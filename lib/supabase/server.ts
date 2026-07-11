import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Server-side Supabase client for Server Components / Route Handlers / Server
// Actions. Still uses the ANON key + the caller's session cookie — RLS still
// enforces every read/write. This is NOT the privileged client.
export function createClient() {
  const cookieStore = cookies();

<<<<<<< HEAD
  return createServerClient(
=======
  return createServerClient<Database>(
>>>>>>> 95a688f375e7bcd8fc3212ca95c220e5dbd9e549
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component — safe to ignore if middleware
            // is refreshing the session.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // see above
          }
        },
      },
    }
  );
}
