"use client";

import type { ReadingProgress, UserGoal } from "@/lib/types";

interface StreakTrackerProps {
  progress: ReadingProgress | null;
  goal: UserGoal | null;
}

export default function StreakTracker({ progress, goal }: StreakTrackerProps) {
  if (!progress && !goal) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl p-10 text-center"
        style={{
          border: "1px dashed rgba(255,255,255,0.1)",
          background: "rgba(7,20,38,0.5)",
        }}
      >
        <div
          className="flex h-13 w-13 items-center justify-center rounded-2xl text-2xl"
          style={{
            border: "1px solid var(--border)",
            background: "var(--bg-raised)",
          }}
        >
          📖
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            No progress yet
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-dim)" }}>
            Set a goal to begin your journey
          </p>
        </div>
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

  return (
    <div className="space-y-3">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 animate-fade-up"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,162,39,0.3), transparent)",
            }}
          />
          <div
            className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-base"
            style={{
              border: "1px solid rgba(201,162,39,0.2)",
              background: "rgba(201,162,39,0.08)",
            }}
          >
            🔥
          </div>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-cinzel), serif", color: "var(--text)" }}
          >
            {streakDays}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
            Day streak
          </p>
        </div>

        {/* Total verses */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 animate-fade-up anim-delay-1"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
          <div
            className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-base"
            style={{
              border: "1px solid rgba(16,185,129,0.2)",
              background: "rgba(16,185,129,0.07)",
            }}
          >
            📖
          </div>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-cinzel), serif", color: "var(--text)" }}
          >
            {totalRead.toLocaleString()}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
            Verses completed
          </p>
        </div>
      </div>

      {/* Weekly progress */}
      {goal && weeklyTarget > 0 && (
        <div
          className="relative overflow-hidden rounded-2xl p-5 animate-fade-up anim-delay-2"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent)",
            }}
          />
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Weekly progress
            </span>
            <span className="text-xs tabular-nums" style={{ color: "var(--text-dim)" }}>
              {thisWeekRead} / {weeklyTarget}
            </span>
          </div>

          {/* Progress bar */}
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

          <p className="mt-2.5 text-xs" style={{ color: "var(--text-dim)" }}>
            {weeklyLabel}
          </p>
        </div>
      )}

      {progress?.lastReadAt && (
        <p className="text-right text-xs" style={{ color: "var(--text-dim)" }}>
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
