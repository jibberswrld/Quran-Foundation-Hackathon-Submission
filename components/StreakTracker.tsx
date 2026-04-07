"use client";

import type { ReadingProgress, UserGoal } from "@/lib/types";

interface StreakTrackerProps {
  progress: ReadingProgress | null;
  goal: UserGoal | null;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-stone-200 rounded-full h-2">
      <div
        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
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
      <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center text-stone-400 text-sm">
        No progress yet. Set a goal to get started!
      </div>
    );
  }

  const streakDays = progress?.streakDays ?? 0;
  const totalRead = progress?.totalVersesRead ?? 0;

  // Compute a weekly target from the goal
  let weeklyTarget = 0;
  let weeklyLabel = "";
  if (goal) {
    if (goal.type === "finish_in_days") {
      // ~6,236 total verses / days × 7
      weeklyTarget = Math.ceil((6236 / goal.value) * 7);
      weeklyLabel = `${weeklyTarget} verses / week to finish in ${goal.value} days`;
    } else {
      weeklyTarget = goal.value;
      weeklyLabel = `${goal.value} ayahs / week to memorise`;
    }
  }

  // Approximate this week's verses as totalRead mod weeklyTarget
  const thisWeekRead =
    weeklyTarget > 0 ? totalRead % weeklyTarget : totalRead;

  const statCards: { label: string; value: string | number; icon: string }[] =
    [
      { label: "Current streak", value: `${streakDays} day${streakDays !== 1 ? "s" : ""}`, icon: "🔥" },
      { label: "Verses completed", value: totalRead.toLocaleString(), icon: "📖" },
    ];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col gap-1"
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="text-2xl font-bold text-stone-800">{s.value}</span>
            <span className="text-xs text-stone-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Weekly progress */}
      {goal && weeklyTarget > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-stone-700">Weekly progress</span>
            <span className="text-stone-400">
              {thisWeekRead} / {weeklyTarget}
            </span>
          </div>
          <ProgressBar value={thisWeekRead} max={weeklyTarget} />
          <p className="text-xs text-stone-400">{weeklyLabel}</p>
        </div>
      )}

      {progress?.lastReadAt && (
        <p className="text-xs text-stone-400 text-right">
          Last read:{" "}
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
