// Hand-authored types mirroring supabase/schema.sql.
// In production, regenerate with:
//   npx supabase gen types typescript --project-id <id> > types/database.ts
// Kept hand-written here so the starter compiles without a live project.

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  city: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type Couple = {
  id: string;
  couple_code: string;
  invite_code: string;
  invite_expires_at: string | null;
  anniversary_date: string | null;
  status: "pending" | "active";
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CoupleMember = {
  couple_id: string;
  user_id: string;
  role: "partner" | "owner";
  joined_at: string;
};

export type JournalEntry = {
  id: string;
  couple_id: string;
  author_id: string;
  prompt: string | null;
  title: string | null;
  content: string;
  mood: string | null;
  entry_date: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MemoryType =
  | "first_text" | "first_call" | "first_date" | "first_meet"
  | "birthday" | "trip" | "anniversary" | "milestone" | "other";

export type Memory = {
  id: string;
  couple_id: string;
  created_by: string;
  type: MemoryType;
  title: string;
  description: string | null;
  memory_date: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type TimeCapsule = {
  id: string;
  couple_id: string;
  created_by: string;
  title: string;
  message: string | null;
  unlock_at: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
};

export type BucketListItem = {
  id: string;
  couple_id: string;
  created_by: string;
  category: "travel" | "food" | "movies" | "games" | "books" | "other";
  title: string;
  notes: string | null;
  is_completed: boolean;
  completed_at: string | null;
  target_date: string | null;
  created_at: string;
};

// Minimal Supabase `Database` shape — extend with generated types before
// production use. Typed loosely here to keep the starter self-contained.
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> };
      couples: { Row: Couple; Insert: Partial<Couple>; Update: Partial<Couple> };
      couple_members: { Row: CoupleMember; Insert: Partial<CoupleMember>; Update: Partial<CoupleMember> };
      journal_entries: { Row: JournalEntry; Insert: Partial<JournalEntry>; Update: Partial<JournalEntry> };
      memories: { Row: Memory; Insert: Partial<Memory>; Update: Partial<Memory> };
      time_capsules: { Row: TimeCapsule; Insert: Partial<TimeCapsule>; Update: Partial<TimeCapsule> };
      bucket_list_items: { Row: BucketListItem; Insert: Partial<BucketListItem>; Update: Partial<BucketListItem> };
      [key: string]: { Row: any; Insert: any; Update: any };
    };
    Functions: {
      join_couple_by_invite_code: { Args: { p_invite_code: string }; Returns: string };
      current_couple_id: { Args: Record<string, never>; Returns: string };
    };
  };
};
