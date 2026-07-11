# EverAfter — Architecture & Security

## 1. Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (Postgres 15, Auth, Storage, Row-Level Security)
- **Hosting:** Vercel (frontend/API routes), Supabase Cloud (DB/Storage/Auth)
- **Future:** OpenAI API for the AI Companion (additive, not load-bearing for MVP)

## 2. High-Level Architecture

```
┌─────────────┐      HTTPS      ┌──────────────────┐      RLS-scoped SQL      ┌──────────────┐
│   Browser   │ ───────────────▶│  Next.js (Vercel) │ ────────────────────────▶│   Supabase   │
│  (React UI) │◀─────────────── │  Server Actions/   │◀──────────────────────── │  Postgres    │
└─────────────┘   streamed RSC  │  Route Handlers    │      Supabase JS SDK     │  Auth        │
                                 └──────────────────┘                           │  Storage     │
                                                                                 └──────────────┘
```

- The Next.js server never uses the Supabase **service role** key for user-facing requests.
  All reads/writes go through the **anon/public** key + the user's session JWT, so RLS is
  always the enforcing layer — a compromised API route still can't cross tenant boundaries.
- The service role key is reserved for: scheduled jobs (Wrapped generation, notification
  dispatch), and the invite-code RPC path where `SECURITY DEFINER` functions do the
  privileged step explicitly and narrowly (see `schema.sql`).

## 3. Authentication Flow

1. User signs up via Supabase Auth (Google OAuth, email/password, or magic link).
2. Supabase issues a session JWT containing `sub` (= `auth.uid()`).
3. On first login, a `profiles` row is created (`id = auth.uid()`).
4. Client calls `create_couple` or `join_couple_by_invite_code`.
5. Every subsequent request carries the JWT; Postgres RLS resolves `current_couple_id()`
   from `couple_members` on every query — there is no separate "session couple_id" to spoof.

```
Sign up ──▶ profiles row created ──▶ Create Space | Join with Code
                                            │              │
                                   couples row created   join_couple_by_invite_code(code)
                                   (status: pending)             │
                                            │              couple_members row inserted
                                   couple_members row              │
                                   inserted (role: owner)   status → active (2nd member)
                                            └───────────┬──────────┘
                                                         ▼
                                                     Dashboard
```

## 4. Authorization Model (Row-Level Security)

**Rule:** every couple-scoped table has RLS enabled, and every policy filters on
`couple_id = current_couple_id()`, where `current_couple_id()` is a `STABLE SECURITY DEFINER`
SQL function resolving strictly from `auth.uid()` via `couple_members`. See `schema.sql` for
the full policy set. Key properties:

- **No frontend trust.** The Next.js layer filters by couple purely for UX (e.g., "show my
  couple's journal"); if it forgot to filter, RLS would still block cross-tenant rows.
- **INSERT policies double-check identity.** E.g. `journal_insert` requires both
  `couple_id = current_couple_id()` AND `author_id = auth.uid()` — a user cannot write into
  their partner's authorship or forge a `couple_id`.
- **Adversarial testing requirement.** Before launch, run a test suite that authenticates as
  User A and attempts every CRUD operation against User B's `couple_id`; every attempt must
  fail. This is a release gate, not a nice-to-have.

## 5. Threat Model & Mitigations

| Threat | Mitigation |
|---|---|
| SQL Injection | Supabase JS client uses parameterized queries exclusively; no raw string SQL concatenation anywhere in the codebase |
| XSS | React auto-escapes by default; any `dangerouslySetInnerHTML` usage is banned in code review; CSP headers set in `next.config.js` |
| CSRF | Server Actions use Next.js's built-in same-origin enforcement; cookies are `SameSite=Lax`, `Secure`, `HttpOnly` |
| Brute force | Supabase Auth rate-limits sign-in attempts; add Vercel Edge middleware rate limiting on auth routes for defense in depth |
| Unauthorized API calls | Every Route Handler re-derives identity from the session JWT server-side; never trusts a client-supplied `couple_id` |
| Cross-tenant data leak | RLS as the single source of truth (see §4); no query path bypasses it except scheduled service-role jobs, which are narrowly scoped and audited |
| Session hijacking | HttpOnly cookies, short-lived JWTs with refresh rotation (Supabase default) |
| Password storage | Never handled by app code — Supabase Auth stores only salted+hashed credentials |

## 6. Privacy Architecture

- **No public surface area.** There is no route, API, or table query that lists users or
  couples across tenants. Search only ever operates within `current_couple_id()`.
- **Data export:** a Route Handler (service-role, narrowly scoped) collects every row where
  `couple_id = :id` across all tables + signed Storage URLs, zips it, and returns a download.
- **Data deletion:** a two-step confirmation triggers a service-role transaction that deletes
  the `couples` row; `on delete cascade` foreign keys remove all dependent rows and a Storage
  cleanup job removes associated files.
- **Access transparency:** the Privacy Center reads `couple_members` for the user's own couple
  and displays exactly the linked accounts — nothing else is queryable.

## 7. Encryption

**Today (v1):**
- TLS/HTTPS everywhere (enforced by Vercel + Supabase by default).
- Postgres data encrypted at rest (Supabase-managed).
- Storage objects encrypted at rest (Supabase-managed, backed by cloud provider KMS).
- Sensitive free-text fields (journal `content`, capsule `message`) are stored as-is in v1,
  protected by RLS + at-rest encryption — equivalent to the security bar of e.g. iCloud notes.

**Future — End-to-End Encryption (E2EE):**
- Concept: each couple gets a symmetric key derived from both partners' credentials
  (e.g. via a key exchange at pairing time), stored client-side only (or split via a
  threshold scheme). Journal/media content is encrypted client-side before upload; the
  server only ever sees ciphertext.
- **Trade-offs to design around before building this:**
  - Search (journal search, AI "find memories with sunsets") becomes very hard — either
    lose full-text search or add client-side indexing/homomorphic tricks.
  - Account recovery becomes harder: lose the key, lose the data — need an explicit,
    user-consented recovery mechanism (e.g. recovery phrase) instead of "reset password."
  - Server-side features (Wrapped generation, notifications, AI Companion) need either
    client-side computation or a scheme where the server can't read plaintext but can
    still trigger jobs (e.g. client periodically decrypts and posts derived summaries).
  - Media thumbnails/previews would need to be generated client-side.
- **Recommendation:** ship v1 with strong at-rest + in-transit encryption + strict RLS
  (current architecture), and introduce E2EE as an opt-in "Vault Lock" mode later once the
  UX for key recovery and the search trade-off are validated with real users.

## 8. Scalability Notes
- Every content table is indexed on `(couple_id, <natural sort column>)` for fast timeline
  queries at any scale (see `schema.sql` indexes).
- Media is never stored in Postgres — only metadata; binary content lives in Supabase
  Storage (S3-compatible), fronted by CDN caching.
- Pagination is cursor-based on `created_at`/`entry_date` rather than `OFFSET`, to stay
  performant as tables grow into the millions of rows.
- Wrapped stats are precomputed into `wrapped_snapshots` by a scheduled job rather than
  computed on read.
- The API layer (Next.js Route Handlers / Server Actions) is stateless, so horizontal
  scaling on Vercel requires no additional work.
- If a single Postgres instance becomes the bottleneck at massive scale, `couple_id` is a
  natural shard key — every table is already structured to support sharding or read
  replicas without redesign.

## 9. Folder Structure

```
everafter/
├── app/
│   ├── (marketing)/            # public landing page, no auth required
│   │   └── page.tsx
│   ├── (auth)/                 # sign-in / sign-up / magic link
│   │   ├── login/page.tsx
│   │   └── callback/route.ts
│   └── (app)/                  # authenticated app shell
│       ├── layout.tsx          # sidebar/nav, session guard
│       ├── onboarding/page.tsx # create/join couple space
│       ├── dashboard/page.tsx
│       ├── journal/page.tsx
│       ├── memories/page.tsx
│       └── capsules/page.tsx
├── components/
│   ├── ui/                     # design-system primitives (Button, Card, GlassPanel...)
│   ├── layout/                 # Sidebar, TopBar, PageShell
│   ├── dashboard/
│   ├── journal/
│   ├── memories/
│   └── capsules/
├── lib/
│   ├── supabase/                # client/server Supabase factory functions
│   └── services/                 # typed data-access functions per domain
├── hooks/                        # client-side React hooks
├── types/                        # shared TypeScript types (mirrors schema.sql)
├── supabase/
│   └── schema.sql                # full DB schema + RLS (source of truth)
├── docs/                          # PRD, architecture, deployment, roadmap
└── public/
```

## 10. Deployment Guide

1. **Supabase project:** create a project, run `supabase/schema.sql` in the SQL editor
   (or via `supabase db push`), create a private `media` Storage bucket, and set up
   matching Storage RLS policies (see comment block at the end of `schema.sql`).
2. **Auth providers:** enable Email, Magic Link, and Google in Supabase Auth settings;
   add the OAuth redirect URL for your Vercel domain.
3. **Environment variables** (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, used solely in scheduled jobs / export-delete routes)
   - `OPENAI_API_KEY` (reserved for future AI Companion)
4. **Vercel:** import the repo, set the env vars above, deploy. Framework preset:
   Next.js App Router.
5. **Scheduled jobs** (Vercel Cron): daily journal reminder, capsule-unlock check,
   monthly/yearly Wrapped generation — configured in `vercel.json`.

## 11. Testing Strategy
- **Unit:** service-layer functions (lib/services) tested with mocked Supabase client.
- **RLS/security:** SQL-level test suite (pgTAP or a Vitest+Supabase-JS harness) asserting
  cross-couple access always fails — this is the most important test suite in the project.
- **Integration:** Playwright covering sign-up → create space → invite partner → post
  journal entry → create capsule → verify partner sees it, stranger does not.
- **Accessibility:** automated axe-core checks on every page in CI.

## 12. Future Roadmap
See `docs/ROADMAP.md`.
