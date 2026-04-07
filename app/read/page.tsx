import ReadClient from "./ReadClient";

export const metadata = {
  title: "Daily Read · Quran Coach",
  description: "Today's assigned verses, audio, and AI reflection.",
};

export default function ReadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Daily Read</h1>
      <ReadClient />
    </div>
  );
}
