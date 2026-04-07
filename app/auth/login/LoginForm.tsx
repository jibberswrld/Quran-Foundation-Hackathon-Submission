"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
      <div className="w-full max-w-md rounded-2xl border border-amber-900/40 bg-amber-950/30 p-6 text-sm text-amber-400">
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2 text-amber-500/70">
          Add{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">
            .env.local
          </code>
          , then restart the dev server.
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
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Sign in to continue your journey.
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
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
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
              className="mb-1.5 block text-xs font-medium text-zinc-500"
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
            className="btn-primary mt-2 w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-600">
        No account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Create one →
        </Link>
      </p>
    </div>
  );
}
