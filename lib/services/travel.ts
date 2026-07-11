import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type TravelStatus = "visited" | "want_to_visit" | "next_trip";

export async function listTravelPins(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("travel_pins")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function createTravelPin(
  supabase: SupabaseClient,
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