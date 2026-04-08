import type { Metadata } from "next";
import Link from "next/link";
import ClearLocalDataSection from "./ClearLocalDataSection";
import GoalEditorSection from "@/components/GoalEditorSection";

export const metadata: Metadata = {
  title: "Settings · Quran Coach",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-10 animate-fade-up">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: "var(--text-dim)" }}
        >
          ← Dashboard
        </Link>
        <h1
          className="mt-5 text-4xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Settings
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Update your reading plan. Your data stays on this device only.
        </p>
      </div>

      <GoalEditorSection />

      <section className="animate-fade-up anim-delay-2">
        <p className="section-label mb-4">Data on this device</p>
        <ClearLocalDataSection />
      </section>
    </div>
  );
}
