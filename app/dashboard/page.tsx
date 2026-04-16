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
        <DashboardClient />
      </div>
    </RequireGoal>
  );
}
