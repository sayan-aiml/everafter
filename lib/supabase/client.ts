"use client";

// Browser-side Supabase client. Uses the ANON key only — RLS is what keeps
// this safe. Never import the service role key here.
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
<<<<<<< HEAD
  return createBrowserClient(
=======
  return createBrowserClient<Database>(
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
