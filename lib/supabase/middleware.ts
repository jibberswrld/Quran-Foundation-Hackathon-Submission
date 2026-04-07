import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { isSupabaseConfigured } from "./config";

/**
 * Refreshes the Auth session and forwards updated cookies on the response.
 * When Supabase is configured, protects app routes and redirects unauthenticated users to /auth/login.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/dashboard", "/read", "/onboarding"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  function forwardAuthCookies(res: NextResponse) {
    supabaseResponse.cookies.getAll().forEach((c) => {
      res.cookies.set(c.name, c.value);
    });
    return res;
  }

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path);
    return forwardAuthCookies(NextResponse.redirect(url));
  }

  if (
    user &&
    (path === "/auth/login" || path === "/auth/signup")
  ) {
    return forwardAuthCookies(NextResponse.redirect(new URL("/", request.url)));
  }

  return supabaseResponse;
}
