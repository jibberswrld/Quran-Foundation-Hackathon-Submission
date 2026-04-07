import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard · Quran Coach",
  description: "Your streaks, progress, and bookmarked verses.",
};

export default function DashboardPage() {
  return (
    <div className="page-container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Dashboard</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Your reading journey at a glance.</p>
      </div>
      <DashboardClient />
    </div>
  );
}
