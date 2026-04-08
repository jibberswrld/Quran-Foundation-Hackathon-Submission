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
        if (
          /already\s+registered|already\s+been\s+registered|user\s+already\s+exists/i.test(
            msg
          )
        ) {
          setError(
            "This email is already registered. Sign in instead, or use "Resend confirmation" below if you still need to verify your email."
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
      <div
        className="w-full max-w-md rounded-2xl p-6 text-sm"
        style={{
          border: "1px solid rgba(180,120,20,0.35)",
          background: "rgba(60,30,0,0.3)",
          color: "#fbbf24",
        }}
      >
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2 opacity-70">
          Add Supabase URL and anon key to{" "}
          <code className="rounded px-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            .env.local
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-up">
      {/* Logo + heading */}
      <div className="text-center">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl animate-glow-pulse"
          style={{
            background: "linear-gradient(135deg, #c9a227 0%, #8f5500 100%)",
            boxShadow:
              "0 0 0 1px rgba(201,162,39,0.4), 0 8px 28px rgba(201,162,39,0.25)",
          }}
        >
          ☽
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Create your account
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          Next you&apos;ll set your daily goal and reading pace.
        </p>
      </div>

      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.04) 0%, transparent 60%)",
          }}
        />

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {error && (
            <p
              className="rounded-xl border px-3 py-2.5 text-sm"
              style={{
                borderColor: "var(--red-border)",
                background: "var(--red-bg)",
                color: "var(--red-text)",
              }}
            >
              {error}
            </p>
          )}
          {message && (
            <p
              className="rounded-xl border px-3 py-2.5 text-sm"
              style={{
                borderColor: "rgba(201,162,39,0.3)",
                background: "rgba(201,162,39,0.07)",
                color: "var(--gold)",
              }}
            >
              {message}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
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
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
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
              className="mb-1.5 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
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
              aria-invalid={
                confirmPassword.length > 0 && password !== confirmPassword
              }
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1.5 text-xs" style={{ color: "#fbbf24" }}>
                Passwords must match.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full py-2.5 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border-2 inline-block"
                  style={{
                    borderColor: "#1a0f00",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Creating account…
              </span>
            ) : (
              "Create account & continue"
            )}
          </button>
        </form>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(7,20,38,0.5)",
          border: "1px solid var(--border)",
        }}
      >
        <ResendSignupEmail key={email} defaultEmail={email} />
      </div>

      <details
        className="rounded-xl px-4 py-3 text-xs"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(7,20,38,0.4)",
          color: "var(--text-dim)",
        }}
      >
        <summary
          className="cursor-pointer font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Confirmation email / different browser?
        </summary>
        <p className="mt-2 leading-relaxed">
          If the link errors in another browser, open Supabase Dashboard →
          Authentication → Email templates →{" "}
          <strong style={{ color: "var(--text-muted)" }}>Confirm signup</strong>{" "}
          and set the confirmation URL to include{" "}
          <code
            className="rounded px-1"
            style={{ background: "rgba(0,0,0,0.3)", color: "var(--text-muted)" }}
          >
            token_hash
          </code>
          . Example:{" "}
          <code
            className="break-all rounded px-1"
            style={{ background: "rgba(0,0,0,0.3)", color: "var(--text-muted)" }}
          >
            /auth/callback?token_hash=&#123;&#123; .TokenHash &#125;&#125;&amp;type=signup&amp;next=%2Fonboarding
          </code>
        </p>
      </details>

      <p className="text-center text-sm" style={{ color: "var(--text-dim)" }}>
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium transition-colors"
          style={{ color: "var(--gold)" }}
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
}
