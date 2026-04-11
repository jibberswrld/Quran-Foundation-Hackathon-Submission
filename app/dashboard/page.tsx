import RequireGoal from "@/components/RequireGoal";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard · Quran Coach",
  description: "Your streaks, progress, and bookmarked verses.",
};

export default function DashboardPage() {
  return (
    <RequireGoal>
      <div className="page-container py-16">
        <div className="mb-12">
          <div className="animate-fade-up">
            <p className="section-label mb-2">Overview</p>
            <h1
              className="text-4xl font-normal tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Dashboard
            </h1>
          </div>
          <p
            className="mt-2 text-sm animate-fade-up anim-delay-1"
            style={{ color: "var(--text-muted)" }}
          >
            Your reading journey at a glance.
          </p>
        </div>
        <DashboardClient />
      </div>
    </RequireGoal>
  );
}
