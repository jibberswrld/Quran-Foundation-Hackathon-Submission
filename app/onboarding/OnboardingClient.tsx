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

    const goal: UserGoal = {
      type: goalType,
      value: goalValue,
      startedAt: new Date().toISOString(),
    };

    saveGoal(goal);

    // Best-effort sync — don't block navigation if it fails
    try {
      await syncGoalToApi(goal);
    } catch {
      // Silently continue; local-first state is already saved
    }

    void upsertUserGoalAction(goal);

    setSaving(false);
    router.push("/dashboard");
  }

  const desc = GOAL_DESCRIPTIONS[goalType];

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">☽</span>
        <h1 className="text-3xl font-bold text-stone-800">Welcome to Quran Coach</h1>
        <p className="text-stone-500 mt-2 text-sm">
          Set your reading goal and we&apos;ll build a personalised daily plan.
        </p>
      </div>

      {/* Step: type */}
      {step === "type" && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
            What&apos;s your goal?
          </h2>
          {(Object.keys(GOAL_DESCRIPTIONS) as GoalType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="w-full text-left px-5 py-4 rounded-2xl border-2 border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
            >
              <span className="font-semibold text-stone-800 group-hover:text-emerald-700 block">
                {type === "finish_in_days"
                  ? "Finish the Quran"
                  : "Memorise ayahs"}
              </span>
              <span className="text-sm text-stone-500 mt-1 block">
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
            className="text-sm text-stone-400 hover:text-stone-600"
          >
            ← Back
          </button>
          <div>
            <label
              htmlFor="goal-value"
              className="block text-sm font-semibold text-stone-600 uppercase tracking-wide mb-1"
            >
              {desc.label}
            </label>
            <div className="flex items-center gap-3 mt-2">
              <input
                id="goal-value"
                type="number"
                min={desc.min}
                max={desc.max}
                value={goalValue}
                onChange={(e) =>
                  setGoalValue(Math.max(desc.min, Math.min(desc.max, Number(e.target.value))))
                }
                className="w-32 text-2xl font-bold text-center text-emerald-700 border-2 border-stone-200 rounded-xl py-2 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-stone-500 text-sm">{desc.unit}</span>
            </div>
            {goalType === "finish_in_days" && (
              <p className="text-xs text-stone-400 mt-3">
                That&apos;s roughly{" "}
                <strong className="text-stone-600">
                  {Math.ceil(6236 / goalValue)} verses
                </strong>{" "}
                per day (6,236 total ayahs).
              </p>
            )}
          </div>
          <button
            onClick={handleValueConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-2xl transition-colors"
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
            className="text-sm text-stone-400 hover:text-stone-600"
          >
            ← Back
          </button>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-1">
            <p className="text-stone-500 text-sm">Your goal</p>
            <p className="text-xl font-bold text-emerald-700">
              {goalType === "finish_in_days"
                ? `Finish in ${goalValue} days`
                : `Memorise ${goalValue} ayahs / week`}
            </p>
            <p className="text-xs text-stone-400">
              Starting {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-colors"
          >
            {saving ? "Saving…" : "Start my journey →"}
          </button>
        </div>
      )}
    </div>
  );
}
