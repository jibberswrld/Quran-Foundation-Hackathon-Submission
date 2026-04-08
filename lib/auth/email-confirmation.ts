/**
 * Redirect URL for signup / resend confirmation emails (must match Supabase allow-list).
 */
export function emailConfirmationRedirectUrl(origin: string): string {
  return `${origin}/auth/callback?next=${encodeURIComponent("/onboarding")}`;
}
