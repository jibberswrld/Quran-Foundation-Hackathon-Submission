import Link from "next/link";

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4.5" width="18" height="17" rx="3" />
      <path d="M16 2.5v4M8 2.5v4M3 10h18" />
      <circle cx="8.5" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
      <circle cx="15.5" cy="15" r="0.8" fill="currentColor" />
    </svg>
  );
}

function WordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6h7v12H4zM13 6h7v7h-7zM13 15h7v3h-7z" />
      <path d="M4 3h16" opacity="0.5" />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11.5a3 3 0 1 1 4.2 2.75c-.7.32-1.2.78-1.2 1.5V17" />
      <circle cx="12" cy="20" r="0.9" fill="currentColor" />
      <path d="M4 5h16v12H13l-4 4v-4H4z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3.5H6.5A2.5 2.5 0 0 0 4 6v13.5z" />
      <path d="M8 7h8M8 11h6" opacity="0.6" />
    </svg>
  );
}

function CrescentOrbit() {
  return (
    <div
      className="pointer-events-none relative mx-auto mb-10 h-40 w-40 sm:h-48 sm:w-48 animate-blur-in"
      aria-hidden
    >
      {/* Rotating orbit ring */}
      <div className="absolute inset-0 animate-spin-slow">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px dashed rgba(232, 182, 76, 0.22)",
          }}
        />
        <span
          className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--gold)", boxShadow: "0 0 12px var(--gold)" }}
        />
        <span
          className="absolute right-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
          style={{ background: "var(--sage)", boxShadow: "0 0 8px var(--sage)" }}
        />
      </div>

      {/* Inner glowing core */}
      <div className="absolute inset-6 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, rgba(245, 207, 122, 0.55), rgba(232, 182, 76, 0.12) 55%, transparent 75%)",
          boxShadow: "inset 0 0 40px rgba(232, 182, 76, 0.25)",
        }}
      />

      {/* Crescent */}
      <svg
        className="absolute inset-0 m-auto h-20 w-20 sm:h-24 sm:w-24 drop-shadow-[0_0_24px_rgba(232,182,76,0.45)]"
        viewBox="0 0 24 24"
        fill="none"
      >
        <defs>
          <linearGradient id="crescentGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff1c7" />
            <stop offset="0.55" stopColor="#e8b64c" />
            <stop offset="1" stopColor="#8a5f14" />
          </linearGradient>
        </defs>
        <path
          fill="url(#crescentGrad)"
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        />
      </svg>

      {/* Tiny stars */}
      <span className="absolute right-4 top-6 h-1 w-1 rounded-full bg-white/80 animate-float" />
      <span className="absolute left-6 bottom-8 h-[3px] w-[3px] rounded-full bg-white/70 animate-float-slow" />
      <span className="absolute left-10 top-4 h-0.5 w-0.5 rounded-full bg-white/60" />
    </div>
  );
}

const features = [
  {
    title: "Daily reading plan",
    description: "A pace tailored to your goal. Today's ayahs, waiting quietly.",
    icon: CalendarIcon,
    tone: "gold",
    span: "lg:col-span-2",
  },
  {
    title: "Word by word",
    description: "Study each word with clarity as meaning unfolds.",
    icon: WordIcon,
    tone: "sage",
    span: "",
  },
  {
    title: "Comprehension",
    description: "Short checks to anchor what you retained.",
    icon: QuizIcon,
    tone: "plum",
    span: "",
  },
  {
    title: "Tafsir",
    description: "Scholarly commentary alongside the text, when you reach for it.",
    icon: BookIcon,
    tone: "sage",
    span: "lg:col-span-2",
  },
] as const;

const toneMap = {
  gold: {
    bg: "radial-gradient(circle at 20% 0%, rgba(232, 182, 76, 0.14), transparent 55%)",
    border: "rgba(232, 182, 76, 0.28)",
    color: "var(--gold-soft)",
  },
  sage: {
    bg: "radial-gradient(circle at 20% 0%, rgba(124, 201, 169, 0.14), transparent 55%)",
    border: "rgba(124, 201, 169, 0.28)",
    color: "var(--sage)",
  },
  plum: {
    bg: "radial-gradient(circle at 20% 0%, rgba(163, 139, 201, 0.14), transparent 55%)",
    border: "rgba(163, 139, 201, 0.28)",
    color: "var(--plum)",
  },
} as const;

export default function LandingPage() {
  return (
    <div className="relative page-container overflow-x-clip pb-32 pt-10 sm:pt-14">
      {/* Atmospheric floating orbs */}
      <div
        className="orb animate-float"
        style={{
          top: "8%",
          left: "-6%",
          width: 380,
          height: 380,
          background: "radial-gradient(circle, rgba(232, 182, 76, 0.22), transparent 60%)",
        }}
      />
      <div
        className="orb animate-float-slow"
        style={{
          top: "20%",
          right: "-8%",
          width: 420,
          height: 420,
          background: "radial-gradient(circle, rgba(124, 201, 169, 0.18), transparent 60%)",
        }}
      />
      <div
        className="orb animate-drift"
        style={{
          bottom: "-10%",
          left: "30%",
          width: 520,
          height: 520,
          background: "radial-gradient(circle, rgba(163, 139, 201, 0.14), transparent 60%)",
        }}
      />

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl text-center">
        <div className="animate-fade-up">
          <span className="chip">
            <span className="chip-dot" />
            A calm companion · Ramadan-ready
          </span>
        </div>

        <div className="mt-10">
          <CrescentOrbit />
        </div>

        <h1
          className="font-display text-[2.7rem] font-normal leading-[1.02] tracking-tight sm:text-[4.25rem] animate-fade-up anim-delay-2"
          style={{ color: "var(--text)" }}
        >
          Read with{" "}
          <span className="font-serif-italic text-gradient-gold animate-gradient-pan">
            intention
          </span>
          .
          <span
            className="mt-3 block text-[1.35rem] font-light leading-snug sm:text-[1.75rem] sm:mt-4"
            style={{ color: "var(--text-muted)" }}
          >
            One quiet companion for your journey
            <br className="hidden sm:block" />{" "}
            through the Qur&rsquo;an.
          </span>
        </h1>

        {/* Arabic flourish */}
        <p
          className="arabic mx-auto mt-10 max-w-lg text-[1.7rem] leading-[2.4] animate-blur-in anim-delay-3"
          style={{
            color: "var(--gold-soft)",
            textShadow: "0 0 30px rgba(232, 182, 76, 0.25)",
          }}
        >
          ﴿ وَرَتِّلِ ٱلْقُرْآنَ تَرْتِيلًا ﴾
        </p>
        <p
          className="font-serif-italic mx-auto mt-2 max-w-md text-sm animate-fade-up anim-delay-4"
          style={{ color: "var(--text-dim)" }}
        >
          &ldquo;and recite the Qur&rsquo;an, slowly and with care.&rdquo;
          <span className="ml-2 tracking-wider">— 73:4</span>
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 animate-fade-up anim-delay-5">
          <Link
            href="/onboarding"
            className="btn-primary px-8 py-3.5 text-base"
          >
            Begin your journey
            <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost px-6 py-3.5 text-base"
          >
            Open dashboard
          </Link>
        </div>
      </section>

      {/* ─── Stats strip ─────────────────────────────────────── */}
      <section className="relative mx-auto mt-24 grid max-w-4xl grid-cols-3 gap-px overflow-hidden rounded-2xl animate-fade-up anim-delay-6"
        style={{
          background: "var(--border)",
          border: "1px solid var(--border)",
        }}
      >
        {[
          { value: "114", label: "Surahs" },
          { value: "6,236", label: "Ayahs" },
          { value: "∞", label: "Reflections" },
        ].map((s) => (
          <div
            key={s.label}
            className="group relative flex flex-col items-center justify-center gap-1 py-7 transition-colors"
            style={{ background: "var(--bg-card)" }}
          >
            <p className="font-display text-3xl font-medium tabular-nums sm:text-4xl transition-transform duration-500 group-hover:scale-105"
              style={{ color: "var(--text)" }}
            >
              {s.value}
            </p>
            <p className="section-label !text-[0.65rem]" style={{ color: "var(--text-dim)" }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ─── Features: bento ─────────────────────────────────── */}
      <section className="relative mx-auto mt-28 max-w-6xl sm:mt-36">
        <div className="mb-10 flex items-end justify-between gap-6 animate-fade-up">
          <div>
            <p className="section-label mb-4">The practice</p>
            <h2 className="font-display text-3xl leading-tight sm:text-5xl" style={{ color: "var(--text)" }}>
              Four rituals,{" "}
              <span className="font-serif-italic" style={{ color: "var(--sage)" }}>
                woven together
              </span>
              .
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-relaxed sm:block" style={{ color: "var(--text-muted)" }}>
            Each feature is a small door into the text. Walk through one today, another tomorrow — no pressure, only return.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const tone = toneMap[f.tone];
            return (
              <li
                key={f.title}
                className={`card group relative p-7 text-left animate-fade-up ${f.span}`}
                style={{
                  animationDelay: `${320 + i * 90}ms`,
                  backgroundImage: tone.bg,
                }}
              >
                {/* Corner crosshairs */}
                <span className="crosshair" style={{ top: 10, left: 10 }} />
                <span className="crosshair" style={{ top: 10, right: 10 }} />

                <div
                  className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: `1px solid ${tone.border}`,
                    color: tone.color,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px -12px ${tone.border}`,
                  }}
                >
                  <f.icon />
                </div>

                <h3
                  className="font-display text-xl font-medium leading-tight"
                  style={{ color: "var(--text)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {f.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─── Quiet CTA ───────────────────────────────────────── */}
      <section className="relative mx-auto mt-28 max-w-3xl overflow-hidden rounded-3xl p-10 text-center sm:mt-36 sm:p-14 animate-fade-up"
        style={{
          background: "linear-gradient(165deg, rgba(232, 182, 76, 0.10) 0%, rgba(17, 26, 35, 0.8) 50%, rgba(124, 201, 169, 0.08) 100%)",
          border: "1px solid rgba(232, 182, 76, 0.18)",
        }}
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(232, 182, 76, 0.3), transparent 60%)", filter: "blur(40px)" }}
        />
        <p className="section-label mb-5 justify-center flex">Today</p>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl" style={{ color: "var(--text)" }}>
          Set a goal. <span className="font-serif-italic" style={{ color: "var(--gold-soft)" }}>Return</span> each day.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Small, steady steps. The path is long, and every verse is a candle along it.
        </p>
        <Link
          href="/onboarding"
          className="btn-primary mt-8 px-8 py-3.5 text-base"
        >
          Start in two minutes
        </Link>
      </section>
    </div>
  );
}
