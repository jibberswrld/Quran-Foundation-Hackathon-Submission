/** Optional overrides so Edge middleware can pass env read from the entry file (better inlining on Vercel). */
export type SupabasePublicEnvOverrides = {
  url?: string;
  anonKey?: string;
};

function trimEnv(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t || undefined;
}

/**
 * Resolved public Supabase URL and anon/publishable key (trimmed).
 * Pass `overrides` from `middleware.ts` so Next/Vercel embed values in the Edge bundle reliably.
 */
export function getPublicSupabaseEnv(overrides?: SupabasePublicEnvOverrides) {
  const url = trimEnv(
    overrides?.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const anonKey = trimEnv(
    overrides?.anonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const configured = Boolean(url && anonKey);
  return { url, anonKey, configured };
}

/**
 * Returns true when public Supabase env vars are present (build + runtime).
 */
export function isSupabaseConfigured(overrides?: SupabasePublicEnvOverrides): boolean {
  return getPublicSupabaseEnv(overrides).configured;
}

/**
 * True on Vercel or when running `next start` (production) without public Supabase vars.
 * Without this, middleware skips auth and the home page falls back to localStorage-only
 * mode — anyone can use onboarding and the app with no sign-in.
 */
export function isDeployedWithoutSupabase(
  overrides?: SupabasePublicEnvOverrides
): boolean {
  if (getPublicSupabaseEnv(overrides).configured) return false;
  return (
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
  );
}
