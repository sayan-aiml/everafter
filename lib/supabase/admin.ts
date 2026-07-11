import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// PRIVILEGED CLIENT — service role key, bypasses RLS entirely.
//
// Import this ONLY in:
//   - scheduled jobs (Wrapped generation, notification dispatch)
//   - the Privacy Center export/delete Route Handlers
//
// Every use of this client MUST manually scope every query by an explicit
// couple_id derived from a verified session — never from client input alone.
// Do not import this file from any client component or from a route that
// doesn't need to cross the RLS boundary.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
