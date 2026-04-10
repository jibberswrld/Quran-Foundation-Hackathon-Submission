import { Suspense } from "react";
import ReadClient from "./ReadClient";

export const metadata = {
  title: "Daily Read · Quran Coach",
  description:
    "Today's assigned verses, audio, and tafsir from the Quran.com Content API.",
};

function ReadFallback() {
  return (
    <div className="space-y-4 py-4">
      <div className="skeleton h-6 w-40 rounded" />
      <div className="skeleton h-64 w-full rounded-xl" />
    </div>
  );
}

export default function ReadPage() {
  return (
    <div className="page-container-sm py-16">
      <div className="mb-10">
        <div className="animate-fade-up">
          <p className="section-label mb-2">Today&apos;s session</p>
          <h1
            className="text-4xl font-normal tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Daily Read
          </h1>
        </div>
        <p
          className="mt-2 text-sm animate-fade-up anim-delay-1"
          style={{ color: "var(--text-muted)" }}
        >
          Your assigned verses and tafsir. Tap a bookmark on the dashboard to
          open that ayah with commentary.
        </p>
      </div>
      <Suspense fallback={<ReadFallback />}>
        <div className="animate-fade-up anim-delay-2">
          <ReadClient />
        </div>
      </Suspense>
    </div>
  );
}
