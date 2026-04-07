"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { emailConfirmationRedirectUrl } from "@/lib/auth/email-confirmation";

interface ResendSignupEmailProps {
  defaultEmail?: string;
  className?: string;
  /** Use dark theme inputs to match auth pages */
  variant?: "dark" | "light";
}

export default function ResendSignupEmail({
  defaultEmail = "",
  className = "",
  variant = "dark",
}: ResendSignupEmailProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter the email you used to sign up.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: trimmed,
        options: {
          emailRedirectTo: emailConfirmationRedirectUrl(window.location.origin),
        },
      });
      if (resendError) {
        setError(resendError.message);
        return;
      }
      setMessage(
        "If an account exists for that email, we sent a new confirmation link. Check spam and use the link before it expires."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    variant === "dark"
      ? "input-field"
      : "mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20";

  return (
    <div className={className}>
      <p className="mb-2 text-xs font-medium text-zinc-500">
        Didn&apos;t get an email, or link expired? Resend confirmation
      </p>
      <form onSubmit={handleResend} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="resend-email" className="sr-only">
            Email
          </label>
          <input
            id="resend-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Resend link"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
      {message && (
        <p className="mt-2 text-xs text-emerald-400/90">{message}</p>
      )}
    </div>
  );
}
