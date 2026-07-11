import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type TravelStatus = "visited" | "want_to_visit" | "next_trip";

<<<<<<< HEAD
export async function listTravelPins(supabase: SupabaseClient) {
=======
export async function listTravelPins(supabase: SupabaseClient<Database>) {
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  const { data, error } = await supabase
    .from("travel_pins")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function createTravelPin(
<<<<<<< HEAD
  supabase: SupabaseClient,
=======
  supabase: SupabaseClient<Database>,
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
  pin: {
    couple_id: string;
    created_by: string;
    place_name: string;
    latitude: number;
    longitude: number;
    status: TravelStatus;
    notes?: string;
  }
) {
  const { data, error } = await supabase.from("travel_pins").insert(pin).select().single();
  if (error) throw error;
  return data;
}
