"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GoalType, UserGoal } from "@/lib/types";
import { saveGoal } from "@/lib/storage";
import { syncGoalToApi } from "@/lib/user";
import { upsertUserGoalAction } from "@/app/actions/user-data";

type Step = "type" | "value" | "confirm";

const GOAL_DESCRIPTIONS: Record<GoalType, { label: string; unit: string; min: number; max: number; defaultVal: number }> = {
  finish_in_days: {
    label: "Finish the Quran in",
    unit: "days",
    min: 30,
    max: 3650,
    defaultVal: 365,
  },
  memorize_per_week: {
    label: "Memorise",
    unit: "ayahs per week",
    min: 1,
    max: 100,
    defaultVal: 5,
  },
};

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [goalType, setGoalType] = useState<GoalType>("finish_in_days");
  const [goalValue, setGoalValue] = useState<number>(365);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleTypeSelect(type: GoalType) {
    setGoalType(type);
    setGoalValue(GOAL_DESCRIPTIONS[type].defaultVal);
    setStep("value");
  }

  function handleValueConfirm() {
    setStep("confirm");
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);

    const goal: UserGoal = {
      type: goalType,
      value: goalValue,
      startedAt: new Date().toISOString(),
    };

    saveGoal(goal);

    try {
      await syncGoalToApi(goal);
    } catch {
      // Silently continue; local-first state is already saved
    }

    const remote = await upsertUserGoalAction(goal);
    if (!remote.ok) {
      setSaveError(
        remote.message ??
          (remote.reason === "not_authenticated"
            ? "You must be signed in to finish setup."
            : "Could not save your goal. Check your connection and try again.")
      );
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  }

  const desc = GOAL_DESCRIPTIONS[goalType];

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
          ☽
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
          Welcome to Quran Coach
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Set your reading goal and we&apos;ll build a personalised daily plan.
        </p>
      </div>

      {/* Step: type */}
      {step === "type" && (
        <div className="space-y-3">
          <p className="section-label mb-3">What&apos;s your goal?</p>
          {(Object.keys(GOAL_DESCRIPTIONS) as GoalType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="group w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-left transition-all hover:border-emerald-500/40 hover:bg-zinc-900/80"
            >
              <span className="block font-semibold text-zinc-100 transition-colors group-hover:text-emerald-400">
                {type === "finish_in_days"
                  ? "Finish the Quran"
                  : "Memorise ayahs"}
              </span>
              <span className="mt-1 block text-sm text-zinc-500">
                {type === "finish_in_days"
                  ? "Complete a Khatmah at your own pace"
                  : "Build a weekly memorisation habit"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step: value */}
      {step === "value" && (
        <div className="space-y-6">
          <button
            onClick={() => setStep("type")}
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
          >
            ← Back
          </button>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <label
              htmlFor="goal-value"
              className="section-label block mb-3"
            >
              {desc.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                id="goal-value"
                type="number"
                min={desc.min}
                max={desc.max}
                value={goalValue}
                onChange={(e) =>
                  setGoalValue(Math.max(desc.min, Math.min(desc.max, Number(e.target.value))))
                }
                className="w-32 rounded-xl border border-zinc-700 bg-zinc-950 py-2 text-center text-2xl font-bold text-emerald-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-zinc-500">{desc.unit}</span>
            </div>
            {goalType === "finish_in_days" && (
              <p className="mt-4 text-xs text-zinc-600">
                That&apos;s roughly{" "}
                <strong className="text-zinc-400">
                  {Math.ceil(6236 / goalValue)} verses
                </strong>{" "}
                per day (6,236 total ayahs).
              </p>
            )}
          </div>
          <button
            onClick={handleValueConfirm}
            className="btn-primary w-full py-3 text-sm"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step: confirm */}
      {step === "confirm" && (
        <div className="space-y-6">
          <button
            onClick={() => setStep("value")}
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
          >
            ← Back
          </button>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <p className="text-xs text-zinc-600 mb-1">Your goal</p>
            <p className="text-xl font-bold tracking-tight text-emerald-400">
              {goalType === "finish_in_days"
                ? `Finish in ${goalValue} days`
                : `Memorise ${goalValue} ayahs / week`}
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Starting{" "}
              {new Date().toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {saveError && (
            <p className="rounded-xl border border-red-900/40 bg-red-950/40 px-3 py-2.5 text-center text-sm text-red-400">
              {saveError}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Start my journey →"}
          </button>
        </div>
      )}
    </div>
  );
}
