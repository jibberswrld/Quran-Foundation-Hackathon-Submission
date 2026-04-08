import type { Metadata } from "next";
import Link from "next/link";
import DeleteAccountSection from "./DeleteAccountSection";

export const metadata: Metadata = {
  title: "Settings · Quran Coach",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-emerald-400"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50">Settings</h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Manage your account. Your reading goal can be changed from Goals in the nav.
        </p>
      </div>

      {/* Danger zone */}
      <section>
        <p className="section-label mb-4">Danger zone</p>
        <DeleteAccountSection />
      </section>
    </div>
  );
}
