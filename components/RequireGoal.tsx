"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadLocalUserState } from "@/lib/storage";

export default function RequireGoal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useLayoutEffect(() => {
    const state = loadLocalUserState();
    if (!state.goal) {
      router.replace("/onboarding");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    /* Invisible shell: useLayoutEffect resolves goal before paint when possible,
       so this rarely flashes. Avoid branded loader to prevent refresh flicker. */
    return (
      <div
        className="min-h-[40vh] py-16"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  return <>{children}</>;
}
