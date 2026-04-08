import ReadClient from "./ReadClient";

export const metadata = {
  title: "Daily Read · Quran Coach",
  description: "Today's assigned verses, audio, and AI reflection.",
};

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
          Your assigned verses for today.
        </p>
      </div>
      <ReadClient />
    </div>
  );
}
