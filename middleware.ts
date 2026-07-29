import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // If Supabase environment variables are missing or unconfigured, skip middleware auth check
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("supabase.co") && supabaseUrl.length < 35) {
    return response;
  }

  const protectedPrefixes = [
    "/dashboard",
    "/journal",
    "/memories",
    "/capsules",
    "/onboarding",
    "/vault",
    "/playlist",
    "/bucket-list",
    "/travel",
    "/wrapped",
    "/settings",
  ];
  const isAppRoute = protectedPrefixes.some((p) => request.nextUrl.pathname.startsWith(p));

  // Only check auth session for protected app routes
  if (!isAppRoute) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    // Guard auth.getUser with a 1.2s timeout so DNS/network ENOTFOUND never hangs the request
    const userPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200));

    const userResult = await Promise.race([userPromise, timeoutPromise]);
    const user = (userResult as any)?.data?.user ?? null;

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    // If Supabase fetch fails, allow request to proceed (or redirect if needed)
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};