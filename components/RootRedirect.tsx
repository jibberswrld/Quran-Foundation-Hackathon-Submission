"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadLocalUserState } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/**
 * When Supabase is configured: requires a signed-in user, then redirects by local goal.
 * Without Supabase: same as before (local goal → dashboard vs onboarding).
 */
export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserSupabaseClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            router.replace("/auth/login");
            return;
          }
        } catch {
          router.replace("/auth/login");
          return;
        }
      }

      if (cancelled) return;
      const state = loadLocalUserState();
      if (state.goal) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <span className="text-sm text-stone-400">Loading…</span>
    </div>
  );
}
