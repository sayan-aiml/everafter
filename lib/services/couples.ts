import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// All functions here take a Supabase client (server or browser) that already
// carries the user's session. They never accept or trust a client-supplied
// couple_id — RLS resolves the correct scope from the session on the server.

function generateCoupleCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `LOVE-${suffix}`;
}

export async function createCoupleSpace(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const coupleCode = generateCoupleCode();
  const inviteCode = generateCoupleCode().replace("LOVE-", "JOIN-");

  // Uses the create_couple_space RPC (SECURITY DEFINER) rather than two
  // separate client-side inserts. Doing this as one atomic server-side
  // operation avoids a chicken-and-egg RLS problem: reading the couple row
  // back after insert requires the caller to already be a couple_members
  // row, which doesn't exist until the second insert runs.
  const { data, error } = await supabase.rpc("create_couple_space", {
    p_couple_code: coupleCode,
    p_invite_code: inviteCode,
  });

  if (error) throw error;
  return data;
}

export async function joinCoupleByInviteCode(
  supabase: SupabaseClient<Database>,
  inviteCode: string
) {
  const { data, error } = await supabase.rpc("join_couple_by_invite_code", {
    p_invite_code: inviteCode,
  });
  if (error) throw error;
  return data; // returns the couple_id
}

export async function getMyCouple(supabase: SupabaseClient<Database>) {
  // Relies entirely on RLS: this will only ever return the caller's own
  // couple row, never anyone else's, regardless of what filters are (not)
  // applied here.
  const { data, error } = await supabase.from("couples").select("*").maybeSingle();
  if (error) throw error;
  return data;
}
