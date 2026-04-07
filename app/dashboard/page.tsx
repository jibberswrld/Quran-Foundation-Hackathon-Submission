import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard · Quran Coach",
  description: "Your streaks, progress, and bookmarked verses.",
};

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Dashboard</h1>
      <DashboardClient />
    </div>
  );
}
