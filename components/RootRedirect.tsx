"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadLocalUserState } from "@/lib/storage";

/**
 * Reads the local goal state on mount and redirects accordingly:
 * - No goal → /onboarding
 * - Goal exists → /dashboard
 */
export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const state = loadLocalUserState();
    if (state.goal) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <span className="text-stone-400 text-sm">Loading…</span>
    </div>
  );
}
