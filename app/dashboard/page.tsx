import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard · Quran Coach",
  description: "Your streaks, progress, and bookmarked verses.",
};

export default function DashboardPage() {
  return (
    <div className="page-container py-12">
      {/* Page header */}
      <div className="mb-10 animate-fade-up">
        <p className="section-label mb-2">Overview</p>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Your reading journey at a glance.
        </p>
      </div>
      <DashboardClient />
    </div>
  );
}
