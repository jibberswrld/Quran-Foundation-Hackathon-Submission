"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadGoal } from "@/lib/storage";
import GoalEditorSection from "@/components/GoalEditorSection";
import ClearLocalDataSection from "./ClearLocalDataSection";

export default function SettingsClient() {
  const [hasGoal, setHasGoal] = useState<boolean | null>(null);

  useEffect(() => {
    setHasGoal(Boolean(loadGoal()));
  }, []);

  if (hasGoal === null) {
    return (
      <div
        className="min-h-[30vh]"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  if (!hasGoal) {
    return (
      <section
        className="rounded-xl p-8 text-center animate-fade-up anim-delay-1"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="section-label mb-3 justify-center flex">No plan yet</p>
        <h2
          className="font-display text-2xl leading-tight"
          style={{ color: "var(--text)" }}
        >
          Start onboarding?
        </h2>
        <p
          className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          You haven&rsquo;t set a reading goal yet. Take two minutes to choose a
          pace and we&rsquo;ll build a daily plan around it.
        </p>
        <Link
          href="/onboarding"
          className="btn-primary mt-6 inline-flex px-6 py-2.5 text-sm"
        >
          Start onboarding &rarr;
        </Link>
      </section>
    );
  }

  return (
    <>
      <GoalEditorSection />
      <section className="animate-fade-up anim-delay-2">
        <p className="section-label mb-3">Data</p>
        <ClearLocalDataSection />
      </section>
    </>
  );
}
