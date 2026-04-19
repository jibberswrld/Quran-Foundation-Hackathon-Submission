import type { Metadata } from "next";
import Link from "next/link";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings · Quran Coach",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm transition-colors duration-200 animate-fade-up"
          style={{ color: "var(--text-dim)" }}
        >
          &larr; Dashboard
        </Link>
        <div className="mt-5 animate-fade-up anim-delay-1">
          <h1
            className="text-4xl font-normal tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Settings
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Update your reading plan. Data stays on this device.
          </p>
        </div>
      </div>

      <SettingsClient />
    </div>
  );
}
