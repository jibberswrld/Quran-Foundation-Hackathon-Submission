import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Quran Coach — Read with intention",
  description:
    "Daily reading plan, word-by-word study, AI reflection, comprehension checks, and tafsir in one calm companion.",
};

export default function HomePage() {
  return <LandingPage />;
}
