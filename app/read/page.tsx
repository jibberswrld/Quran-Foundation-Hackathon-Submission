import ReadClient from "./ReadClient";

export const metadata = {
  title: "Daily Read · Quran Coach",
  description: "Today's assigned verses, audio, and AI reflection.",
};

export default function ReadPage() {
  return (
    <div className="page-container-sm py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Daily Read</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Your assigned verses for today.</p>
      </div>
      <ReadClient />
    </div>
  );
}
