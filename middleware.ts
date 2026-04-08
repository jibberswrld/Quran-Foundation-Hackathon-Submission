import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Read public Supabase env here (not only inside lib) so Vercel/Next Edge middleware
 * reliably inlines NEXT_PUBLIC_* at build time. Deep imports alone can leave them empty.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request, {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image optimization.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
