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

  if (user === undefined) {
    return (
      <div className="flex items-center gap-2" aria-hidden>
        <div className="skeleton h-3.5 w-20 rounded" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login" className="nav-link text-sm">
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="btn-primary px-3.5 py-1.5 text-sm"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className="hidden sm:block max-w-[130px] truncate text-xs"
        style={{ color: "var(--text-dim)" }}
        title={user.email ?? ""}
      >
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="nav-link text-sm"
      >
        Sign out
      </button>
    </div>
  );
}
