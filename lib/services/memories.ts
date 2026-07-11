import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Memory, MemoryType } from "@/types/database";

<<<<<<< HEAD
export async function listMemories(supabase: SupabaseClient) {
=======
export async function listMemories(supabase: SupabaseClient<Database>) {
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("memory_date", { ascending: true });
  if (error) throw error;
  return data as Memory[];
}

export async function createMemory(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  memory: {
    couple_id: string;
    created_by: string;
    title: string;
    type: MemoryType;
    memory_date: string;
    description?: string;
    location_name?: string;
  }
) {
  const { data, error } = await supabase.from("memories").insert(memory).select().single();
  if (error) throw error;
  return data as Memory;
}
