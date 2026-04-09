import OnboardingClient from "./OnboardingClient";

export const metadata = {
  title: "Set your goal · Quran Coach",
  description: "Choose your reading pace and start your journey.",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-16">
      <OnboardingClient />
    </div>
  );
}
