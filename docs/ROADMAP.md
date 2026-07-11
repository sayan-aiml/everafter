# EverAfter — Future Roadmap

## Already schema-ready, UI pending (v1.x)
- **Shared Playlist** — table `playlist_songs` exists; needs UI + Spotify/YouTube embed.
- **Travel Map** — table `travel_pins` exists; needs an interactive map (Mapbox/Leaflet)
  with visited/want-to-visit/next-trip pin states and distance-between-partners calculation
  (using each partner's `profiles.city` or live location, opt-in only).
- **Relationship Wrapped** — table `wrapped_snapshots` exists; needs a scheduled job to
  compute stats (days together, photos added, journal entries, most active month, mood
  trends, top songs) and an animated, shareable card UI (canvas/SVG export to image).
- **Notifications** — table exists; needs push (web push / FCM) or email delivery via a
  transactional provider (Resend/Postmark) triggered by Vercel Cron.

## v2 — AI Companion
- Scope: retrieval-augmented chat that only ever sees one couple's data.
- Architecture: a server-side Route Handler embeds the couple's journal/memory/media
  captions into a vector store scoped by `couple_id` (e.g. pgvector column on relevant
  tables, filtered by the same RLS-equivalent `couple_id` check at the application layer
  since pgvector similarity search still runs through the same RLS-protected tables).
  Each AI request re-derives `couple_id` from the session, never from client input.
- Example capabilities: "When did we first talk about Japan?", "Find memories with
  sunsets", "Write an anniversary letter", "Summarize our last year", "Suggest date ideas."
- Guardrail: the AI's context window is constructed server-side from a scoped SQL query —
  it is architecturally incapable of seeing another couple's data because it never has
  access to a raw "all memories" query, only "memories where couple_id = current couple."

## v2 — End-to-End Encryption ("Vault Lock" opt-in mode)
See `ARCHITECTURE.md` §7 for the full trade-off discussion (search, recovery, and
server-side feature impact). Ship as an opt-in mode once UX for key recovery is validated.

## Later ideas
- Anniversary "site" export — turn a couple's Wrapped + top memories into a shareable,
  privacy-gated static page for a single occasion (e.g. wedding).
- Multi-language journal prompts.
- Apple Watch / widget for "days together" and daily question.
- Family/legacy mode: optional, explicit succession settings for who can access a couple's
  archive in the event of account inactivity — fully opt-in, never default.
