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
        className="flex flex-col items-center justify-center gap-3 rounded-xl p-10 text-center"
        style={{
          border: "1px dashed var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
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

  return (
    <div className="space-y-3">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 animate-fade-up"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="section-label mb-3">Streak</p>
          <p
            className="text-3xl font-semibold tracking-tight tabular-nums"
            style={{ color: "var(--text)" }}
          >
            {streakDays}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
            days
          </p>
        </div>

        <div
          className="rounded-xl p-4 animate-fade-up anim-delay-1"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="section-label mb-3">Verses read</p>
          <p
            className="text-3xl font-semibold tracking-tight tabular-nums"
            style={{ color: "var(--text)" }}
          >
            {totalRead.toLocaleString()}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
            total
          </p>
        </div>
      </div>

      {/* Weekly progress */}
      {goal && weeklyTarget > 0 && (
        <div
          className="rounded-xl p-4 animate-fade-up anim-delay-2"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Weekly progress
            </span>
            <span
              className="text-xs tabular-nums"
              style={{ color: "var(--text-dim)" }}
            >
              {thisWeekRead} / {weeklyTarget}
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

          <p className="mt-2.5 text-xs" style={{ color: "var(--text-dim)" }}>
            {weeklyLabel}
          </p>
        </div>
      )}

      {progress?.lastReadAt && (
        <p
          className="text-right text-xs"
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
