/**
 * Returns true when public Supabase env vars are present (build + runtime).
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * True on Vercel or when running `next start` (production) without public Supabase vars.
 * Without this, middleware skips auth and the home page falls back to localStorage-only
 * mode — anyone can use onboarding and the app with no sign-in.
 */
export function isDeployedWithoutSupabase(): boolean {
  if (isSupabaseConfigured()) return false;
  return (
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
  );
}
