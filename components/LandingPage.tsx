import Link from "next/link";

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-emerald-400/90"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function WordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-emerald-400/90"
      aria-hidden
    >
      <path
        d="M4 7h6v10H4V7zM14 7h6v6h-6V7zM14 15h6v2h-6v-2z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-emerald-400/90"
      aria-hidden
    >
      <path
        d="M12 3l1.2 4.2L18 9l-4.8 1.8L12 15l-1.2-4.2L6 9l4.8-1.8L12 3z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-emerald-400/90"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.2 1.8c0 1.5-1.5 2-2 2.2" />
      <path d="M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-emerald-400/90"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

const featureDelays = [
  "anim-delay-4",
  "anim-delay-5",
  "anim-delay-6",
  "anim-delay-4",
  "anim-delay-5",
] as const;

const features = [
  {
    title: "Daily reading plan",
    description:
      "A pace tailored to your goal so you always know today's verses.",
    icon: CalendarIcon,
  },
  {
    title: "Word-by-word mode",
    description: "Study each word with clarity as you move through the ayah.",
    icon: WordIcon,
  },
  {
    title: "AI reflection",
    description: "Guided thoughts on the passage to deepen understanding.",
    icon: SparkIcon,
  },
  {
    title: "Comprehension quiz",
    description: "Check what you retained before you move on.",
    icon: QuizIcon,
  },
  {
    title: "Tafsir",
    description: "Scholarly commentary alongside the text, when you need it.",
    icon: BookIcon,
  },
] as const;

export default function LandingPage() {
  return (
    <div className="relative page-container pb-24 pt-12 sm:pb-32 sm:pt-16">
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[min(90vw,520px)] -translate-x-1/2 rounded-full opacity-[0.35] blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(62, 207, 142, 0.22) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="section-label mb-4 animate-fade-up">Quran Coach</p>
        <h1
          className="text-[2.25rem] font-normal leading-[1.15] tracking-tight sm:text-5xl sm:leading-[1.1] animate-fade-up anim-delay-1"
          style={{ color: "var(--text)" }}
        >
          Read with intention.
          <span
            className="mt-2 block sm:mt-3"
            style={{ color: "var(--text-muted)" }}
          >
            One calm companion for your Quran journey.
          </span>
        </h1>
        <p
          className="mx-auto mt-6 max-w-xl text-base sm:text-lg animate-fade-up anim-delay-2"
          style={{ color: "var(--text-muted)" }}
        >
          Set a goal, follow a daily plan, and explore meaning with tafsir,
          reflection, and gentle checks along the way — all in one place.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 animate-fade-up anim-delay-3">
          <Link
            href="/onboarding"
            className="btn-primary px-8 py-3.5 text-base font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.45)]"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg px-5 py-3 text-sm font-medium transition-colors"
            style={{ color: "var(--text-dim)" }}
          >
            Open dashboard
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-20 max-w-5xl sm:mt-28">
        <p
          className="section-label mb-8 text-center animate-fade-up anim-delay-4"
        >
          What you get
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <li
              key={f.title}
              className={`card rounded-2xl p-6 text-left animate-fade-up ${featureDelays[i]}`}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                }}
              >
                <f.icon />
              </div>
              <h2
                className="text-lg font-medium tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {f.title}
              </h2>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {f.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
