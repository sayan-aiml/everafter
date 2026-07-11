import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function updateCoupleSettings(
  supabase: SupabaseClient<Database>,
  coupleId: string,
  updates: { anniversary_date?: string | null }
) {
  const { error } = await supabase.from("couples").update(updates).eq("id", coupleId);
  if (error) throw error;
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: { display_name?: string; city?: string }
) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;
}
