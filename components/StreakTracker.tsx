"use client";

import type { ReadingProgress, UserGoal } from "@/lib/types";

interface StreakTrackerProps {
  progress: ReadingProgress | null;
  goal: UserGoal | null;
}

function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3c2.5 4 6 6 6 10a6 6 0 1 1-12 0c0-2 1.5-3.5 2.5-4.5C9.5 7 9 5 9 3c1.5 1.5 2 2.5 3 0z" />
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6a2 2 0 0 1 2-2h11v14a2 2 0 0 0 2 2H7a2 2 0 0 1-2-2" />
      <path d="M17 4a2 2 0 0 1 2 2v2h-2" />
      <path d="M8 9h6M8 13h6" opacity="0.55" />
    </svg>
  );
}

export default function StreakTracker({ progress, goal }: StreakTrackerProps) {
  if (!progress && !goal) {
    return (
      <div
        className="relative flex flex-col items-center justify-center gap-3 rounded-2xl p-12 text-center overflow-hidden"
        style={{
          border: "1px dashed var(--border)",
          background:
            "radial-gradient(circle at 50% 0%, rgba(232, 182, 76, 0.06), transparent 60%), var(--bg-card)",
        }}
      >
        <div className="h-12 w-12 rounded-full flex items-center justify-center animate-float"
          style={{
            background: "rgba(232, 182, 76, 0.08)",
            border: "1px solid rgba(232, 182, 76, 0.25)",
            color: "var(--gold-soft)",
          }}
        >
          <FlameIcon />
        </div>
        <p className="font-display text-lg" style={{ color: "var(--text)" }}>
          No progress yet
        </p>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          Set a goal to begin your journey
        </p>
      </div>
    );
  }

  const streakDays = progress?.streakDays ?? 0;
  const totalRead = progress?.totalVersesRead ?? 0;

  let weeklyTarget = 0;
  let weeklyLabel = "";
  if (goal) {
    if (goal.type === "finish_in_days") {
      weeklyTarget = Math.ceil((6236 / goal.value) * 7);
      weeklyLabel = `${weeklyTarget} verses / week to finish in ${goal.value} days`;
    } else {
      weeklyTarget = goal.value;
      weeklyLabel = `${goal.value} ayahs / week to memorise`;
    }
  }

  const thisWeekRead =
    weeklyTarget > 0 ? totalRead % weeklyTarget : totalRead;

  const weeklyPct =
    weeklyTarget > 0
      ? Math.min(100, Math.round((thisWeekRead / weeklyTarget) * 100))
      : 0;

  const stats = [
    {
      label: "Streak",
      value: streakDays,
      suffix: "days",
      icon: <FlameIcon />,
      tone: "gold",
    },
    {
      label: "Verses read",
      value: totalRead,
      suffix: "total",
      icon: <ScrollIcon />,
      tone: "sage",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`card relative p-5 animate-fade-up`}
            style={{
              animationDelay: `${i * 80}ms`,
              backgroundImage:
                s.tone === "gold"
                  ? "radial-gradient(circle at 85% 0%, rgba(232, 182, 76, 0.10), transparent 55%)"
                  : "radial-gradient(circle at 85% 0%, rgba(124, 201, 169, 0.10), transparent 55%)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="section-label !text-[0.62rem]">{s.label}</p>
              <span
                className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    s.tone === "gold"
                      ? "rgba(232, 182, 76, 0.10)"
                      : "rgba(124, 201, 169, 0.10)",
                  color:
                    s.tone === "gold" ? "var(--gold-soft)" : "var(--sage)",
                  border: `1px solid ${
                    s.tone === "gold"
                      ? "rgba(232, 182, 76, 0.22)"
                      : "rgba(124, 201, 169, 0.22)"
                  }`,
                }}
              >
                {s.icon}
              </span>
            </div>
            <p
              className="font-display text-[2.25rem] font-medium leading-none tabular-nums"
              style={{ color: "var(--text)" }}
            >
              {s.value.toLocaleString()}
            </p>
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--text-dim)" }}
            >
              {s.suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly progress */}
      {goal && weeklyTarget > 0 && (
        <div
          className="card relative p-5 animate-fade-up anim-delay-2"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(232, 182, 76, 0.08), transparent 60%)",
          }}
        >
          <div className="mb-3 flex items-baseline justify-between">
            <span
              className="font-display text-base"
              style={{ color: "var(--text)" }}
            >
              Weekly progress
            </span>
            <span
              className="text-xs tabular-nums font-medium"
              style={{ color: "var(--gold-soft)" }}
            >
              {thisWeekRead}
              <span style={{ color: "var(--text-dim)" }}> / {weeklyTarget}</span>
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${weeklyPct}%` }}
              role="progressbar"
              aria-valuenow={thisWeekRead}
              aria-valuemin={0}
              aria-valuemax={weeklyTarget}
              aria-label={`${weeklyPct}% complete`}
            />
          </div>

          <p className="mt-3 text-xs" style={{ color: "var(--text-dim)" }}>
            {weeklyLabel}
          </p>
        </div>
      )}

      {progress?.lastReadAt && (
        <p
          className="text-right text-xs font-serif-italic"
          style={{ color: "var(--text-dim)" }}
        >
          Last read{" "}
          {new Date(progress.lastReadAt).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
