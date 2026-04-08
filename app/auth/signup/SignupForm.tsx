"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { emailConfirmationRedirectUrl } from "@/lib/auth/email-confirmation";
import ResendSignupEmail from "@/components/ResendSignupEmail";

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
          emailRedirectTo: emailConfirmationRedirectUrl(origin),
        },
      });
      if (signError) {
        const msg = signError.message ?? "";
        if (/already\s+registered|already\s+been\s+registered|user\s+already\s+exists/i.test(msg)) {
          setError(
            "This email is already registered. Sign in instead, or use “Resend confirmation” below if you still need to verify your email."
          );
        } else {
          setError(msg);
        }
        return;
      }
      if (data.session) {
        router.replace(AFTER_AUTH_PATH);
        router.refresh();
        return;
      }
      setMessage(
        "We sent a confirmation email. Open the link in any browser — you'll be taken to onboarding to set your reading goal. Check spam if you don't see it."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-amber-900/40 bg-amber-950/30 p-6 text-sm text-amber-400">
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2 text-amber-500/70">
          Add Supabase URL and anon key to{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo + heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
          ☽
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Next you&apos;ll set your daily goal and reading pace.
        </p>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 60%)",
          }}
        />

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {error && (
            <p className="rounded-xl border border-red-900/40 bg-red-950/40 px-3 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl border border-emerald-900/30 bg-emerald-950/40 px-3 py-2.5 text-sm text-emerald-400">
              {message}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-500">
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
              className="input-field"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
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
              className="input-field"
              placeholder="Same as password"
              aria-invalid={confirmPassword.length > 0 && password !== confirmPassword}
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1.5 text-xs text-amber-500">Passwords must match.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account & continue"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <ResendSignupEmail key={email} defaultEmail={email} />
      </div>

      <details className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 text-xs text-zinc-600">
        <summary className="cursor-pointer font-medium text-zinc-500">
          Confirmation email / different browser?
        </summary>
        <p className="mt-2 leading-relaxed">
          If the link errors in another browser, open Supabase Dashboard →
          Authentication → Email templates →{" "}
          <strong className="text-zinc-400">Confirm signup</strong> and set the
          confirmation URL to include{" "}
          <code className="rounded bg-zinc-800 px-1 text-zinc-400">token_hash</code>. Example:{" "}
          <code className="break-all rounded bg-zinc-800 px-1 text-zinc-400">
            /auth/callback?token_hash=&#123;&#123; .TokenHash &#125;&#125;&amp;type=signup&amp;next=%2Fonboarding
          </code>
        </p>
      </details>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
}
