"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadLocalUserState } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

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
          const { data: goalRow } = await supabase
            .from("user_goals")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (cancelled) return;
          if (!goalRow) {
            router.replace("/onboarding");
            return;
          }
          router.replace("/dashboard");
          return;
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
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
        ☽
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}
