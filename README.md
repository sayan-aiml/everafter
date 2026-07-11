# EverAfter

A private, premium digital home for two people — journal, memory timeline, time capsules,
and more. Built as a scalable multi-tenant SaaS from day one, currently configured for a
single couple.

## What's in this repo

- `docs/PRD.md` — full product requirements
- `docs/ARCHITECTURE.md` — system architecture, auth flow, security & privacy design, encryption roadmap, deployment guide, testing strategy
- `docs/ROADMAP.md` — future features (Wrapped, AI Companion, E2EE, Playlist, Travel Map)
- `supabase/schema.sql` — complete Postgres schema with Row-Level Security (source of truth for the data model)
- `app/`, `components/`, `lib/`, `types/` — working Next.js 14 App Router codebase implementing:
  - Auth (Google OAuth, email/password, magic link)
  - Couple Space creation + invite-code join
  - Home Dashboard
  - Couple Journal (daily prompt, timeline)
  - Memory Timeline
  - Time Capsules (locked until unlock date)
  - Dark, gold/lavender glassmorphism design system

Playlist, Travel Map, Relationship Wrapped, and the AI Companion are fully schema-ready
(see `supabase/schema.sql`) but their UI is intentionally deferred — see `docs/ROADMAP.md`.

## Quick Start

### 1. Create a Supabase project
- Go to [supabase.com](https://supabase.com) → New Project.
- In the SQL Editor, run the entire contents of `supabase/schema.sql`.
- In Storage, create a private bucket named `media`.
- In Authentication → Providers, enable **Email**, and **Google** (add your OAuth
  client ID/secret and set the redirect URL to `https://your-domain.com/callback`,
  and `http://localhost:3000/callback` for local dev).

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
Supabase → Project Settings → API. Fill in `SUPABASE_SERVICE_ROLE_KEY` from the same
page — **never commit this or expose it to the browser.**

### 3. Install & run
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`.

### 4. Deploy
- Push this repo to GitHub.
- Import into [Vercel](https://vercel.com), set the same environment variables in
  Project Settings → Environment Variables.
- Deploy. Framework preset: Next.js.

Full details, including the authentication sequence diagram, RLS policy design, and the
current-vs-future encryption architecture, are in `docs/ARCHITECTURE.md`.

## Security model in one sentence
Every table carries `couple_id`; every Row-Level Security policy filters on
`couple_id = current_couple_id()`, resolved server-side from the session — the frontend
is never trusted as an authorization boundary.

## Adding your own anniversary date
Once your couple space is created, update the `anniversary_date` column on your `couples`
row (via the Supabase Table Editor for now — a settings UI is a natural next addition)
to power the "Days Together" counter on the dashboard.
