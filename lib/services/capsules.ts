import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TimeCapsule } from "@/types/database";

<<<<<<< HEAD
export async function listTimeCapsules(supabase: SupabaseClient) {
=======
export async function listTimeCapsules(supabase: SupabaseClient<Database>) {
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  const { data, error } = await supabase
    .from("time_capsules")
    .select("*")
    .order("unlock_at", { ascending: true });
  if (error) throw error;
  // Defense in depth: never render `message` client-side for capsules that
  // aren't unlocked yet, even though RLS already returns the row. The UI
  // layer strips it explicitly so a locked capsule can still show its title
  // and countdown without ever exposing content pre-unlock.
  return (data as TimeCapsule[]).map((c) => ({
    ...c,
    message: c.is_unlocked || new Date(c.unlock_at) <= new Date() ? c.message : null,
  }));
}

export async function createTimeCapsule(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  capsule: { couple_id: string; created_by: string; title: string; message?: string; unlock_at: string }
) {
  const { data, error } = await supabase.from("time_capsules").insert(capsule).select().single();
  if (error) throw error;
  return data as TimeCapsule;
}
