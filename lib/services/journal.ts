import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, JournalEntry } from "@/types/database";

export async function listJournalEntries(
  supabase: SupabaseClient,
  { limit = 20, before }: { limit?: number; before?: string } = {}
) {
  let query = supabase
    .from("journal_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .limit(limit);

  if (before) query = query.lt("entry_date", before);

  const { data, error } = await query;
  if (error) throw error;
  return data as JournalEntry[];
}

export async function createJournalEntry(
  supabase: SupabaseClient,
  entry: {
    couple_id: string;
    author_id: string;
    content: string;
    title?: string;
    prompt?: string;
    mood?: string;
    is_private?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data as JournalEntry;
}