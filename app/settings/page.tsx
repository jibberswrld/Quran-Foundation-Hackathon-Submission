import type { Metadata } from "next";
import Link from "next/link";
import ClearLocalDataSection from "./ClearLocalDataSection";
import GoalEditorSection from "@/components/GoalEditorSection";

export const metadata: Metadata = {
  title: "Settings · Quran Coach",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="mb-10 animate-fade-up">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: "var(--text-dim)" }}
        >
          &larr; Dashboard
        </Link>
        <h1
          className="mt-5 text-4xl font-normal tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Settings
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Update your reading plan. Data stays on this device.
        </p>
      </div>

      <GoalEditorSection />

      <section className="animate-fade-up anim-delay-2">
        <p className="section-label mb-3">Data</p>
        <ClearLocalDataSection />
      </section>
    </div>
  );
}
