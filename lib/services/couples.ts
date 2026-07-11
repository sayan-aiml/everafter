import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function generateCoupleCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `LOVE-${suffix}`;
}

export async function createCoupleSpace(
  supabase: SupabaseClient,
  userId: string
) {
  const coupleCode = generateCoupleCode();
  const inviteCode = generateCoupleCode().replace("LOVE-", "JOIN-");

  const { data, error } = await supabase.rpc("create_couple_space", {
    p_couple_code: coupleCode,
    p_invite_code: inviteCode,
  });

  if (error) throw error;
  return data;
}

export async function joinCoupleByInviteCode(
  supabase: SupabaseClient,
  inviteCode: string
) {
  const { data, error } = await supabase.rpc("join_couple_by_invite_code", {
    p_invite_code: inviteCode,
  });
  if (error) throw error;
  return data;
}

export async function getMyCouple(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("couples").select("*").maybeSingle();
  if (error) throw error;
  return data;
}