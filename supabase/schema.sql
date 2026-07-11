-- ============================================================================
-- EVERAFTER — Database Schema
-- Postgres 15+ / Supabase
--
-- Design principles:
--   1. Every content table carries couple_id (never nullable).
--   2. RLS is the ONLY authorization boundary. Frontend checks are UX sugar.
--   3. auth.uid() -> profiles.id -> couple_members.couple_id is the trust chain.
--   4. Soft-delete where users expect "undo"; hard-delete only via Privacy Center.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. PROFILES  (extends auth.users, 1:1)
-- ============================================================================
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text not null default 'Someone',
  avatar_url      text,
  city            text,               -- for optional "weather in partner's city"
  timezone        text default 'UTC',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================================
-- 2. COUPLES  (the tenant/root entity — everything hangs off this)
-- ============================================================================
create table public.couples (
  id              uuid primary key default uuid_generate_v4(),
  couple_code     text unique not null,          -- e.g. LOVE-AB92X, shown to users
  invite_code     text unique not null,          -- single-use/rotatable join code
  invite_expires_at timestamptz,
  anniversary_date date,
  status          text not null default 'pending' -- 'pending' (1 member) | 'active' (2 members)
                    check (status in ('pending','active')),
  created_by      uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_couples_invite_code on public.couples(invite_code);

-- Membership join table. Deliberately modeled as N:M (capped at 2 by app logic
-- + trigger) rather than two FK columns on `couples`, so future "extended
-- family space" or "poly" configurations don't require a schema migration.
create table public.couple_members (
  couple_id       uuid not null references public.couples(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  role            text not null default 'partner' check (role in ('partner','owner')),
  joined_at       timestamptz not null default now(),
  primary key (couple_id, user_id)
);

-- Enforce max 2 members per couple at the DB layer (defense in depth).
create or replace function public.enforce_couple_capacity()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.couple_members where couple_id = new.couple_id) >= 2 then
    raise exception 'This couple space already has two members.';
  end if;
  return new;
end;
$$;

create trigger trg_couple_capacity
before insert on public.couple_members
for each row execute function public.enforce_couple_capacity();

-- Every authenticated user belongs to at most one couple. Enforced by a
-- unique index on user_id (a user row cannot appear twice across any couple).
create unique index idx_one_couple_per_user on public.couple_members(user_id);

-- Flip couples.status to 'active' once the second member joins.
create or replace function public.activate_couple_on_second_member()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.couple_members where couple_id = new.couple_id) = 2 then
    update public.couples set status = 'active', updated_at = now() where id = new.couple_id;
  end if;
  return new;
end;
$$;

create trigger trg_activate_couple
after insert on public.couple_members
for each row execute function public.activate_couple_on_second_member();

-- ----------------------------------------------------------------------------
-- Helper: resolve the caller's couple_id. Used by every RLS policy below.
-- STABLE + SECURITY DEFINER so it can read couple_members regardless of the
-- calling row's RLS, but it only ever returns data tied to auth.uid().
-- ----------------------------------------------------------------------------
create or replace function public.current_couple_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select couple_id from public.couple_members where user_id = auth.uid() limit 1;
$$;

-- ============================================================================
-- 3. JOURNAL ENTRIES
-- ============================================================================
create table public.journal_entries (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  author_id       uuid not null references public.profiles(id),
  prompt          text,                 -- daily prompt this entry answers, if any
  title           text,
  content         text not null,
  mood            text,                 -- emoji or mood tag for check-ins
  entry_date      date not null default current_date,
  is_private      boolean not null default false, -- author-only "diary" mode
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index idx_journal_couple on public.journal_entries(couple_id, entry_date desc);

-- ============================================================================
-- 4. MEMORIES  (timeline milestones)
-- ============================================================================
create table public.memories (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  created_by      uuid not null references public.profiles(id),
  type            text not null default 'milestone'
                    check (type in ('first_text','first_call','first_date','first_meet',
                                     'birthday','trip','anniversary','milestone','other')),
  title           text not null,
  description     text,
  memory_date     date not null,
  location_name   text,
  latitude        numeric(9,6),
  longitude       numeric(9,6),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index idx_memories_couple_date on public.memories(couple_id, memory_date);

-- ============================================================================
-- 5. MEDIA  (photos / videos / voice notes / documents — polymorphic vault)
-- ============================================================================
create table public.media (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  uploaded_by     uuid not null references public.profiles(id),
  storage_path    text not null,        -- path within Supabase Storage bucket
  media_type      text not null check (media_type in ('photo','video','audio','document')),
  mime_type       text,
  size_bytes      bigint,
  width           int,
  height          int,
  duration_seconds int,
  caption         text,
  album_id        uuid,                 -- optional grouping, see albums table
  -- Polymorphic attachment: a media row can belong to a journal entry,
  -- a memory, a time capsule, or stand alone in the vault.
  attached_to_type text check (attached_to_type in ('journal_entry','memory','time_capsule', null)),
  attached_to_id  uuid,
  is_encrypted    boolean not null default false,
  encryption_key_id text,               -- reference into KMS/secret manager, never the raw key
  created_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index idx_media_couple on public.media(couple_id);
create index idx_media_attachment on public.media(attached_to_type, attached_to_id);

create table public.albums (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  title           text not null,
  cover_media_id  uuid references public.media(id),
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- 6. TIME CAPSULES
-- ============================================================================
create table public.time_capsules (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  created_by      uuid not null references public.profiles(id),
  title           text not null,
  message          text,                -- the letter / text content
  unlock_at       timestamptz not null,
  is_unlocked     boolean not null default false,
  unlocked_at     timestamptz,
  created_at      timestamptz not null default now()
);
create index idx_capsules_couple on public.time_capsules(couple_id, unlock_at);

-- ============================================================================
-- 7. BUCKET LIST
-- ============================================================================
create table public.bucket_list_items (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  created_by      uuid not null references public.profiles(id),
  category        text not null default 'other'
                    check (category in ('travel','food','movies','games','books','other')),
  title           text not null,
  notes           text,
  is_completed    boolean not null default false,
  completed_at    timestamptz,
  target_date     date,
  created_at      timestamptz not null default now()
);
create index idx_bucket_couple on public.bucket_list_items(couple_id, is_completed);

-- ============================================================================
-- 8. SONGS / SHARED PLAYLIST
-- ============================================================================
create table public.playlist_songs (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  added_by        uuid not null references public.profiles(id),
  title           text not null,
  artist          text,
  spotify_url     text,
  youtube_url     text,
  memory_note     text,                 -- "the song that was playing when..."
  created_at      timestamptz not null default now()
);
create index idx_playlist_couple on public.playlist_songs(couple_id);

-- ============================================================================
-- 9. TRAVEL MAP PINS
-- ============================================================================
create table public.travel_pins (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  created_by      uuid not null references public.profiles(id),
  place_name      text not null,
  latitude        numeric(9,6) not null,
  longitude       numeric(9,6) not null,
  status          text not null default 'want_to_visit'
                    check (status in ('visited','want_to_visit','next_trip')),
  visit_date      date,
  notes           text,
  created_at      timestamptz not null default now()
);
create index idx_travel_couple on public.travel_pins(couple_id);

-- ============================================================================
-- 10. NOTIFICATIONS
-- ============================================================================
create table public.notifications (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  user_id         uuid not null references public.profiles(id),  -- recipient
  type            text not null check (type in
                    ('journal_reminder','anniversary','capsule_unlock','bucket_reminder','custom')),
  title           text not null,
  body            text,
  is_read         boolean not null default false,
  scheduled_for   timestamptz,
  sent_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index idx_notifications_user on public.notifications(user_id, is_read);

-- ============================================================================
-- 11. RELATIONSHIP WRAPPED  (precomputed recap snapshots)
-- ============================================================================
create table public.wrapped_snapshots (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  period_type     text not null check (period_type in ('monthly','yearly')),
  period_start    date not null,
  period_end      date not null,
  stats           jsonb not null default '{}',  -- {days_together, photos_added, ...}
  generated_at    timestamptz not null default now(),
  unique (couple_id, period_type, period_start)
);
create index idx_wrapped_couple on public.wrapped_snapshots(couple_id, period_start desc);

-- ============================================================================
-- 12. DAILY QUESTIONS / MOOD CHECK-INS (dashboard widgets)
-- ============================================================================
create table public.mood_checkins (
  id              uuid primary key default uuid_generate_v4(),
  couple_id       uuid not null references public.couples(id) on delete cascade,
  user_id         uuid not null references public.profiles(id),
  mood            text not null,
  note            text,
  checkin_date    date not null default current_date,
  created_at      timestamptz not null default now(),
  unique (user_id, checkin_date)
);

-- ============================================================================
-- AUTO-UPDATE `updated_at` TRIGGER (generic, reused across tables)
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_couples_updated before update on public.couples
  for each row execute function public.set_updated_at();
create trigger trg_journal_updated before update on public.journal_entries
  for each row execute function public.set_updated_at();
create trigger trg_memories_updated before update on public.memories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- Pattern: couple_id = current_couple_id() for SELECT/UPDATE/DELETE.
--          INSERT additionally checks the inserting user is a couple member.
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.journal_entries enable row level security;
alter table public.memories enable row level security;
alter table public.media enable row level security;
alter table public.albums enable row level security;
alter table public.time_capsules enable row level security;
alter table public.bucket_list_items enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.travel_pins enable row level security;
alter table public.notifications enable row level security;
alter table public.wrapped_snapshots enable row level security;
alter table public.mood_checkins enable row level security;

-- profiles: a user can read their own profile and their partner's.
create policy "profiles_select_self_or_partner" on public.profiles
  for select using (
    id = auth.uid() or id in (
      select user_id from public.couple_members
      where couple_id = public.current_couple_id()
    )
  );
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

-- couples: members can read/update their own couple row only.
create policy "couples_select_member" on public.couples
  for select using (id = public.current_couple_id());
create policy "couples_update_member" on public.couples
  for update using (id = public.current_couple_id());
create policy "couples_insert_creator" on public.couples
  for insert with check (created_by = auth.uid());

-- couple_members: readable by members of that couple; a user may insert
-- themself (joining via invite code is validated in an RPC, see below).
create policy "members_select_own_couple" on public.couple_members
  for select using (couple_id = public.current_couple_id() or user_id = auth.uid());
create policy "members_insert_self" on public.couple_members
  for insert with check (user_id = auth.uid());

-- Generic template applied to every couple-scoped content table:
--   SELECT/UPDATE/DELETE: couple_id = current_couple_id()
--   INSERT: couple_id = current_couple_id() AND the *_by/author/user column = auth.uid()

create policy "journal_select" on public.journal_entries for select
  using (couple_id = public.current_couple_id() and (is_private = false or author_id = auth.uid()));
create policy "journal_insert" on public.journal_entries for insert
  with check (couple_id = public.current_couple_id() and author_id = auth.uid());
create policy "journal_update" on public.journal_entries for update
  using (couple_id = public.current_couple_id() and author_id = auth.uid());
create policy "journal_delete" on public.journal_entries for delete
  using (couple_id = public.current_couple_id() and author_id = auth.uid());

create policy "memories_select" on public.memories for select using (couple_id = public.current_couple_id());
create policy "memories_insert" on public.memories for insert
  with check (couple_id = public.current_couple_id() and created_by = auth.uid());
create policy "memories_update" on public.memories for update using (couple_id = public.current_couple_id());
create policy "memories_delete" on public.memories for delete using (couple_id = public.current_couple_id());

create policy "media_select" on public.media for select using (couple_id = public.current_couple_id());
create policy "media_insert" on public.media for insert
  with check (couple_id = public.current_couple_id() and uploaded_by = auth.uid());
create policy "media_delete" on public.media for delete using (couple_id = public.current_couple_id());

create policy "albums_all" on public.albums for all using (couple_id = public.current_couple_id())
  with check (couple_id = public.current_couple_id());

create policy "capsules_select" on public.time_capsules for select using (couple_id = public.current_couple_id());
create policy "capsules_insert" on public.time_capsules for insert
  with check (couple_id = public.current_couple_id() and created_by = auth.uid());
create policy "capsules_update" on public.time_capsules for update using (couple_id = public.current_couple_id());

create policy "bucket_all" on public.bucket_list_items for all using (couple_id = public.current_couple_id())
  with check (couple_id = public.current_couple_id());

create policy "playlist_all" on public.playlist_songs for all using (couple_id = public.current_couple_id())
  with check (couple_id = public.current_couple_id());

create policy "travel_all" on public.travel_pins for all using (couple_id = public.current_couple_id())
  with check (couple_id = public.current_couple_id());

create policy "notifications_select_own" on public.notifications for select using (user_id = auth.uid());
create policy "notifications_update_own" on public.notifications for update using (user_id = auth.uid());

create policy "wrapped_select" on public.wrapped_snapshots for select using (couple_id = public.current_couple_id());

create policy "mood_select" on public.mood_checkins for select using (couple_id = public.current_couple_id());
create policy "mood_insert" on public.mood_checkins for insert
  with check (couple_id = public.current_couple_id() and user_id = auth.uid());

-- ============================================================================
-- RPC: create_couple_space
-- Creates the couple AND adds the creator as a member in one atomic,
-- privileged transaction. Doing this as a single server-side operation
-- avoids an RLS chicken-and-egg problem: reading the couple row back after
-- a plain client-side insert requires the caller to already be a
-- couple_members row, which doesn't exist until the second insert runs.
-- ============================================================================
create or replace function public.create_couple_space(
  p_couple_code text,
  p_invite_code text
)
returns public.couples
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple public.couples;
begin
  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'You already belong to a couple space.';
  end if;

  insert into public.couples (couple_code, invite_code, created_by)
  values (p_couple_code, p_invite_code, auth.uid())
  returning * into v_couple;

  insert into public.couple_members (couple_id, user_id, role)
  values (v_couple.id, auth.uid(), 'owner');

  return v_couple;
end;
$$;

-- ============================================================================
-- RPC: join_couple_by_invite_code
-- Runs as SECURITY DEFINER so it can validate + insert atomically without
-- widening couple_members INSERT policy to arbitrary rows.
-- ============================================================================
create or replace function public.join_couple_by_invite_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
begin
  select id into v_couple_id from public.couples
    where invite_code = p_invite_code
      and status = 'pending'
      and (invite_expires_at is null or invite_expires_at > now());

  if v_couple_id is null then
    raise exception 'Invalid or expired invite code.';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'You already belong to a couple space.';
  end if;

  insert into public.couple_members (couple_id, user_id, role) values (v_couple_id, auth.uid(), 'partner');

  return v_couple_id;
end;
$$;

-- ============================================================================
-- STORAGE BUCKETS
-- Create the 'media' bucket via Supabase Dashboard -> Storage -> New bucket
-- (name: media, private) or: insert into storage.buckets (id, name, public)
-- values ('media', 'media', false);
--
-- Path convention: {couple_id}/{filename}. Policies below check the leading
-- path segment against the caller's own couple_id, mirroring table RLS.
-- ============================================================================
create policy "media_storage_select"
on storage.objects for select
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = public.current_couple_id()::text
);

create policy "media_storage_insert"
on storage.objects for insert
with check (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = public.current_couple_id()::text
);

create policy "media_storage_delete"
on storage.objects for delete
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = public.current_couple_id()::text
);
