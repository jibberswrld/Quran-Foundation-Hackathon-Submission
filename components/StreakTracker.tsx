"use client";

import type { ReadingProgress, UserGoal } from "@/lib/types";

interface StreakTrackerProps {
  progress: ReadingProgress | null;
  goal: UserGoal | null;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-500"
        style={{
          width: `${pct}%`,
          boxShadow: pct > 0 ? "0 0 8px rgba(34,197,94,0.5)" : "none",
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${pct}% complete`}
      />
    </div>
  );
}

export default function StreakTracker({ progress, goal }: StreakTrackerProps) {
  if (!progress && !goal) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-2xl">
          📖
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-300">No progress yet</p>
          <p className="mt-0.5 text-xs text-zinc-600">Set a goal to get started!</p>
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

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-base">
            🔥
          </div>
          <p className="text-3xl font-bold tracking-tight text-zinc-50">
            {streakDays}
          </p>
          <p className="mt-1 text-xs text-zinc-600">Day streak</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-base">
            📖
          </div>
          <p className="text-3xl font-bold tracking-tight text-zinc-50">
            {totalRead.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-zinc-600">Verses completed</p>
        </div>
      </div>

      {/* Weekly progress */}
      {goal && weeklyTarget > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Weekly progress</span>
            <span className="text-xs text-zinc-600">
              {thisWeekRead} / {weeklyTarget}
            </span>
          </div>
          <ProgressBar value={thisWeekRead} max={weeklyTarget} />
          <p className="mt-2.5 text-xs text-zinc-600">{weeklyLabel}</p>
        </div>
      )}

      {progress?.lastReadAt && (
        <p className="text-right text-xs text-zinc-700">
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
