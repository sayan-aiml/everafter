# EverAfter — Product Requirements Document

## 1. Vision
EverAfter is a private digital home for couples — the operating system for a relationship.
It combines a shared journal, a memory timeline, locked time capsules, a media vault, and
an AI companion, wrapped in an Apple-level, cinematic dark UI. It launches as a single-couple
anniversary gift but is architected from day one as multi-tenant SaaS.

## 2. Target User
- **v1:** One couple (founder + partner), used as a private anniversary gift.
- **v2+:** Any couple who wants a private, ad-free, non-social space to preserve their relationship.

## 3. Non-Goals
- No public profiles, discovery, following, or social feed — ever. Privacy is the product.
- No third-party data monetization.
- Not a dating app; couples must already be a couple (invite-code only).

## 4. Core Principles
1. **Two people, one space.** A couple is the tenant. Nothing exists without a `couple_id`.
2. **Backend is the only authority.** Every authorization decision is enforced by Postgres RLS,
   never by frontend logic alone.
3. **Privacy by default.** No feature ships without an answer to "can the other couple see this?" (no)
   and "can the user delete/export this?" (yes).
4. **Premium by feel.** Motion, glass, restraint — never gimmicky.

## 5. Feature Set (MVP → v1)

| Feature | MVP | v1 |
|---|---|---|
| Auth (Google, Email, Magic Link) | ✅ | ✅ |
| Couple Space creation + invite code | ✅ | ✅ |
| Home Dashboard (days together, today's memory, daily question) | ✅ | ✅ |
| Couple Journal (prompts, timeline, search) | ✅ | ✅ |
| Memory Timeline (milestones, media attached) | ✅ | ✅ |
| Memory Vault (photo/video/audio storage, albums) | ✅ | ✅ |
| Time Capsules (locked until date) | ✅ | ✅ |
| Bucket List | ✅ | ✅ |
| Shared Playlist | — | ✅ |
| Travel Map | — | ✅ |
| Relationship Wrapped | — | ✅ |
| AI Companion | — | v2 (post-MVP, additive architecture only) |
| Notifications (push/email) | — | ✅ |
| Privacy Center (export/delete/see access) | ✅ | ✅ |

MVP is scoped so the founder can ship a working, secure, beautiful gift quickly, while every
schema/API decision already supports the full v1 feature list without migration surprises.

## 6. Key User Flows

### 6.1 Onboarding
1. User signs up (Google / email+password / magic link).
2. Prompted: "Create a new space" or "Join with invite code."
3. **Create:** app generates `couple_code` (e.g. `LOVE-AB92X`) and `invite_code`; couple status = `pending`.
4. **Join:** user enters invite code → RPC `join_couple_by_invite_code` validates and links them;
   couple status flips to `active` once both members are present.
5. Redirect to Dashboard.

### 6.2 Daily Use
- Dashboard shows days together, today's memory-on-this-day, latest journal entry, daily
  prompt, mood check-in, upcoming anniversary/capsule countdowns.
- Journal: answer today's prompt or free-write; attach photo/voice note.
- Add a memory or drop a photo into the vault.

### 6.3 Time Capsule
- Create capsule: title, message, optional media, unlock date.
- Capsule is locked (content not queryable/renderable) until `unlock_at <= now()`.
- On unlock date, notification fires; opening plays a countdown/reveal animation.

### 6.4 Privacy Center
- "Export my data" → generates a downloadable JSON/zip of all couple content.
- "Delete everything" → two-step confirmation, cascades through all tables via `couple_id`.
- "Who has access" → shows exactly the two linked accounts, nothing else.

## 7. Success Metrics (post-MVP)
- Daily journal completion rate per active couple.
- Time-to-first-memory-added after signup.
- Retention: couples still logging in at 90 days.
- Zero cross-tenant data exposure incidents (hard requirement, not aspirational).

## 8. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Cross-couple data leak | RLS enforced at DB layer; every policy tested with adversarial couple_id swap tests |
| One partner leaves/account deleted | Soft-delete + "couple paused" state rather than hard cascade on user deletion |
| Emotional data loss (no backups) | Supabase point-in-time recovery + nightly export job to cold storage |
| AI feature scope creep pre-MVP | AI Companion explicitly deferred; architecture reviewed for extensibility only |

## 9. Deliverable Scope of This Build
This repository ships: PRD (this doc), architecture & security docs, full DB schema with RLS,
a working Next.js starter implementing auth, couple creation/join, dashboard, journal, memory
timeline, and time capsules end-to-end. Playlist, travel map, wrapped, and AI companion are
schema-ready but UI is stubbed for v1 follow-up — see `docs/ROADMAP.md`.
