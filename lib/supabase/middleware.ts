import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { isSupabaseConfigured } from "./config";

/**
 * Refreshes Auth cookies. When Supabase is configured:
 * - Requires sign-in for /dashboard, /read, /onboarding
 * - Requires a saved reading goal (user_goals row) before /, /dashboard, or /read
 *   so email confirmation alone does not unlock the app until onboarding finishes.
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

  function forwardAuthCookies(res: NextResponse) {
    supabaseResponse.cookies.getAll().forEach((c) => {
      res.cookies.set(c.name, c.value);
    });
    return res;
  }

  const protectedPaths = ["/dashboard", "/read", "/onboarding", "/settings"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path);
    return forwardAuthCookies(NextResponse.redirect(url));
  }

  if (user && (path === "/auth/login" || path === "/auth/signup")) {
    return forwardAuthCookies(NextResponse.redirect(new URL("/", request.url)));
  }

  const pathNeedsGoal =
    path === "/" ||
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/read" ||
    path.startsWith("/read/");

  if (user && pathNeedsGoal) {
    const { data: goalRow } = await supabase
      .from("user_goals")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!goalRow) {
      return forwardAuthCookies(
        NextResponse.redirect(new URL("/onboarding", request.url))
      );
    }
  }

  return supabaseResponse;
}
