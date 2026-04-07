"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** After email confirmation + after instant signup (no confirm), send users here first */
const AFTER_AUTH_PATH = "/onboarding";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Type the same password twice.");
      return;
    }

    setLoading(true);
    try {
      const origin = window.location.origin;
      const supabase = createBrowserSupabaseClient();
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(AFTER_AUTH_PATH)}`,
        },
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      if (data.session) {
        router.replace(AFTER_AUTH_PATH);
        router.refresh();
        return;
      }
      setMessage(
        "We sent a confirmation email. Open the link in any browser or device — you will be taken to onboarding to set your reading goal. If you don’t see the email, check spam."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2 text-amber-800">
          Add Supabase URL and anon key to{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-800">Create your account</h1>
        <p className="mt-2 text-sm text-stone-500">
          Next you&apos;ll set your daily goal and reading pace — the same for every new account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-stone-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-stone-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-medium text-stone-600"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Same as password"
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-emerald-500"
            aria-invalid={confirmPassword.length > 0 && password !== confirmPassword}
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="mt-1 text-xs text-amber-700">Passwords must match.</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-stone-300"
        >
          {loading ? "Creating account…" : "Create account & continue"}
        </button>
      </form>

      <details className="rounded-xl border border-stone-100 bg-stone-50/80 px-4 py-3 text-xs text-stone-500">
        <summary className="cursor-pointer font-medium text-stone-600">
          Confirmation email / different browser?
        </summary>
        <p className="mt-2 leading-relaxed">
          If the link errors in another browser, open Supabase Dashboard → Authentication → Email
          templates → <strong>Confirm signup</strong> and use a link like: your site{" "}
          <code className="break-all rounded bg-white px-1 text-[11px] text-stone-700">
            /auth/callback?token_hash={"{{ .TokenHash }}"}&amp;type=signup&amp;next=%2Fonboarding
          </code>{" "}
          (mustache variables come from Supabase&apos;s template docs).
        </p>
      </details>

      <p className="text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
