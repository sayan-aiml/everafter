import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function updateCoupleSettings(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  coupleId: string,
  updates: { anniversary_date?: string | null }
) {
  const { error } = await supabase.from("couples").update(updates).eq("id", coupleId);
  if (error) throw error;
}

export async function updateProfile(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  userId: string,
  updates: { display_name?: string; city?: string }
) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;
}
