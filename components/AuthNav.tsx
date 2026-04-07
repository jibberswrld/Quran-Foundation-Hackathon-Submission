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

  if (!configured) {
    return null;
  }

  if (user === undefined) {
    return <span className="h-4 w-16 animate-pulse rounded bg-stone-200" aria-hidden />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-stone-600 transition-colors hover:text-emerald-700"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="max-w-[140px] truncate text-xs text-stone-500" title={user.email ?? ""}>
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="text-sm font-medium text-stone-600 hover:text-emerald-700"
      >
        Sign out
      </button>
    </div>
  );
}
