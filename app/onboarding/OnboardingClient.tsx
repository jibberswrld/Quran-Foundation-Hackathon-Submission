"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GoalType, UserGoal } from "@/lib/types";
import { saveGoal } from "@/lib/storage";
import { syncGoalToApi } from "@/lib/user";
import { upsertUserGoalAction } from "@/app/actions/user-data";

type Step = "type" | "value" | "confirm";

const GOAL_DESCRIPTIONS: Record<
  GoalType,
  { label: string; unit: string; min: number; max: number; defaultVal: number }
> = {
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
    <div className="w-full max-w-md animate-fade-up">
      {/* Header */}
      <div className="mb-10 text-center">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl animate-glow-pulse"
          style={{
            background: "linear-gradient(135deg, #c9a227 0%, #8f5500 100%)",
            boxShadow:
              "0 0 0 1px rgba(201,162,39,0.4), 0 8px 28px rgba(201,162,39,0.25)",
          }}
        >
          ☽
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Welcome to Quran Coach
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Set your reading goal and we&apos;ll build a personalised daily plan.
        </p>

        {/* Step indicator */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {(["type", "value", "confirm"] as Step[]).map((s, i) => (
            <div
              key={s}
              className="rounded-full transition-all duration-300"
              style={{
                height: "6px",
                width: step === s ? "20px" : "6px",
                background:
                  step === s
                    ? "linear-gradient(90deg, #c9a227, #e8c96a)"
                    : ["type", "value", "confirm"].indexOf(step) > i
                    ? "rgba(201,162,39,0.4)"
                    : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Step: type */}
      {step === "type" && (
        <div className="space-y-3 animate-fade-up">
          <p className="section-label mb-4">What&apos;s your goal?</p>
          {(Object.keys(GOAL_DESCRIPTIONS) as GoalType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="group w-full rounded-2xl text-left transition-all duration-200"
              style={{
                padding: "1.25rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border-gold)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(201,162,39,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--bg-card)";
              }}
            >
              <span
                className="block font-semibold text-sm transition-colors"
                style={{ color: "var(--text)" }}
              >
                {type === "finish_in_days"
                  ? "Finish the Quran"
                  : "Memorise ayahs"}
              </span>
              <span
                className="mt-1 block text-sm"
                style={{ color: "var(--text-muted)" }}
              >
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
        <div className="space-y-5 animate-fade-up">
          <button
            onClick={() => setStep("type")}
            className="text-sm transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.color = "var(--text-muted)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.color = "var(--text-dim)")
            }
          >
            ← Back
          </button>
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <label htmlFor="goal-value" className="section-label block mb-4">
              {desc.label}
            </label>
            <div className="flex items-center gap-4">
              <input
                id="goal-value"
                type="number"
                min={desc.min}
                max={desc.max}
                value={goalValue}
                onChange={(e) =>
                  setGoalValue(
                    Math.max(desc.min, Math.min(desc.max, Number(e.target.value)))
                  )
                }
                className="w-32 rounded-xl py-2 text-center text-2xl font-bold focus:outline-none"
                style={{
                  background: "rgba(2,12,26,0.8)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--gold)",
                  boxShadow: "0 0 0 3px rgba(201,162,39,0.08)",
                  fontFamily: "var(--font-cinzel), serif",
                }}
              />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {desc.unit}
              </span>
            </div>
            {goalType === "finish_in_days" && (
              <p className="mt-4 text-xs" style={{ color: "var(--text-dim)" }}>
                That&apos;s roughly{" "}
                <strong style={{ color: "var(--text-muted)" }}>
                  {Math.ceil(6236 / goalValue)} verses
                </strong>{" "}
                per day (6,236 total ayahs).
              </p>
            )}
          </div>
          <button onClick={handleValueConfirm} className="btn-primary w-full py-3 text-sm">
            Continue →
          </button>
        </div>
      )}

      {/* Step: confirm */}
      {step === "confirm" && (
        <div className="space-y-5 animate-fade-up">
          <button
            onClick={() => setStep("value")}
            className="text-sm transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.color = "var(--text-muted)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.color = "var(--text-dim)")
            }
          >
            ← Back
          </button>

          {/* Confirm card */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 text-center"
            style={{
              background: "rgba(201,162,39,0.05)",
              border: "1px solid var(--border-gold)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,162,39,0.6), transparent)",
              }}
            />
            <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
              Your goal
            </p>
            <p
              className="text-2xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                color: "var(--gold)",
              }}
            >
              {goalType === "finish_in_days"
                ? `Finish in ${goalValue} days`
                : `Memorise ${goalValue} ayahs / week`}
            </p>
            <div className="ornament my-3">
              <span className="text-xs">✦</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Starting{" "}
              {new Date().toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {saveError && (
            <p
              className="rounded-xl border px-3 py-2.5 text-center text-sm"
              style={{
                borderColor: "var(--red-border)",
                background: "var(--red-bg)",
                color: "var(--red-text)",
              }}
            >
              {saveError}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full py-3 text-sm"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border-2 border-t-transparent inline-block"
                  style={{
                    borderColor: "#1a0f00",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Saving…
              </span>
            ) : (
              "Start my journey →"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
