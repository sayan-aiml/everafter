import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type BucketCategory = "travel" | "food" | "movies" | "games" | "books" | "other";

export async function listBucketItems(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("bucket_list_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function createBucketItem(
  supabase: SupabaseClient<Database>,
  item: { couple_id: string; created_by: string; title: string; category: BucketCategory; notes?: string }
) {
  const { data, error } = await supabase.from("bucket_list_items").insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function toggleBucketItem(
  supabase: SupabaseClient<Database>,
  id: string,
  isCompleted: boolean
) {
  const { error } = await supabase
    .from("bucket_list_items")
    .update({ is_completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}
