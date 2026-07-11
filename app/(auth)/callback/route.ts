import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";

// Exchanges the OAuth/magic-link code for a session, ensures a `profiles`
// row exists, then routes the user to onboarding or their dashboard.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure a profile row exists (idempotent upsert, self-row only —
      // matches the `profiles_insert_self` RLS policy).
      await supabase
        .from("profiles")
        .upsert({ id: data.user.id, display_name: data.user.email?.split("@")[0] ?? "Someone" }, { onConflict: "id" });

      const couple = await getMyCouple(supabase).catch(() => null);
      return NextResponse.redirect(`${origin}${couple ? "/dashboard" : "/onboarding"}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
