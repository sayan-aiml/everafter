import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Memory, MemoryType } from "@/types/database";

export async function listMemories(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("memory_date", { ascending: true });
  if (error) throw error;
  return data as Memory[];
}

export async function createMemory(
  supabase: SupabaseClient<Database>,
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
