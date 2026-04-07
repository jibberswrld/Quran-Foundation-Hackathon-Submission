"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AuthNav() {
  const configured = isSupabaseConfigured();
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!configured) {
      setUser(null);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  async function handleSignOut() {
    if (!configured) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/auth/login");
    router.refresh();
  }

  if (!configured) return null;

  // Loading skeleton
  if (user === undefined) {
    return (
      <div className="flex items-center gap-2">
        <div className="skeleton h-4 w-24 rounded" aria-hidden />
        <div className="skeleton h-7 w-16 rounded-lg" aria-hidden />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-950 transition-all hover:bg-emerald-400 shadow-[0_0_0_1px_rgba(34,197,94,0.3)]"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className="max-w-[140px] truncate text-xs text-zinc-600"
        title={user.email ?? ""}
      >
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
      >
        Sign out
      </button>
    </div>
  );
}
