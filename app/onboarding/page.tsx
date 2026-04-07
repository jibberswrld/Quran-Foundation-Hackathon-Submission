import OnboardingClient from "./OnboardingClient";

export const metadata = {
  title: "Get Started · Quran Coach",
  description: "Set your daily Quran reading goal and pace.",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <OnboardingClient />
    </div>
  );
}
