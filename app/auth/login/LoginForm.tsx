"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ResendSignupEmail from "@/components/ResendSignupEmail";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errFromUrl = searchParams.get("error");
  const nextPath = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errFromUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      const safeNext =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/";
      router.replace(safeNext);
      router.refresh();
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
          Add{" "}
          <code className="rounded px-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded px-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to{" "}
          <code className="rounded px-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            .env.local
          </code>
          , then restart the dev server.
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
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          Sign in to continue your journey.
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
        {/* Top glow */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)",
          }}
        />
        {/* Radial glow */}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
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
                Signing in…
              </span>
            ) : (
              "Sign in"
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

      <p className="text-center text-sm" style={{ color: "var(--text-dim)" }}>
        No account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium transition-colors"
          style={{ color: "var(--gold)" }}
        >
          Create one →
        </Link>
      </p>
    </div>
  );
}
