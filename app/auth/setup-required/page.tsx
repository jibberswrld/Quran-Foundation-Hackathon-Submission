import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuration required · Quran Coach",
};

export default function SetupRequiredPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-6 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]">
        <h1 className="text-lg font-semibold text-amber-100">
          Supabase is not configured on this deployment
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          This build is running without{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-xs text-amber-200/90">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-xs text-amber-200/90">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          . Without them, the app cannot enforce sign-in. Add both in your host
          (for Vercel: Project → Settings → Environment Variables), apply to
          Production (and Preview if you use it), then trigger a new deployment
          so Next.js inlines the public variables at build time.
        </p>
      </div>
    </div>
  );
}
