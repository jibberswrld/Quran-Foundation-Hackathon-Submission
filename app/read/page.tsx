import { Suspense } from "react";
import ReadClient from "./ReadClient";

export const metadata = {
  title: "Daily Read · Quran Coach",
  description: "Today's assigned verses, audio, and tafsir from the Quran.com Content API.",
};

function ReadFallback() {
  return (
    <div className="space-y-5 py-4">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="skeleton h-64 w-full rounded-2xl" />
    </div>
  );
}

export default function ReadPage() {
  return (
    <div className="page-container-sm py-12">
      <div className="mb-8 animate-fade-up">
        <p className="section-label mb-2">Today&apos;s Session</p>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Daily Read
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Your assigned verses and tafsir. Tap a bookmark on the dashboard to
          open that ayah with commentary.
        </p>
      </div>
      <Suspense fallback={<ReadFallback />}>
        <ReadClient />
      </Suspense>
    </div>
  );
}
