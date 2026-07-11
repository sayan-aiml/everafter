import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type BucketCategory = "travel" | "food" | "movies" | "games" | "books" | "other";

<<<<<<< HEAD
export async function listBucketItems(supabase: SupabaseClient) {
=======
export async function listBucketItems(supabase: SupabaseClient<Database>) {
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  const { data, error } = await supabase
    .from("bucket_list_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function createBucketItem(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  item: { couple_id: string; created_by: string; title: string; category: BucketCategory; notes?: string }
) {
  const { data, error } = await supabase.from("bucket_list_items").insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function toggleBucketItem(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  id: string,
  isCompleted: boolean
) {
  const { error } = await supabase
    .from("bucket_list_items")
    .update({ is_completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}
