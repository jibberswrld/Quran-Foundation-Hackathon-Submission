"use client";

import { useState, useId, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import type { GoalType, UserGoal } from "@/lib/types";
import { GOAL_DESCRIPTIONS } from "@/lib/goal-constants";
import { loadGoal, saveGoal } from "@/lib/storage";
import { syncGoalToApi } from "@/lib/user";

type Step = "type" | "value" | "confirm";

export default function OnboardingClient() {
  const moonGradId = `ob-moon-${useId().replace(/:/g, "")}`;
  const router = useRouter();
  const [checkedExisting, setCheckedExisting] = useState(false);
  const [step, setStep] = useState<Step>("type");

  useLayoutEffect(() => {
    if (loadGoal()) {
      router.replace("/read");
      return;
    }
    setCheckedExisting(true);
  }, [router]);
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

    try {
      await syncGoalToApi(goal);
    } catch {
      // local-first
    }

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  }

  const desc = GOAL_DESCRIPTIONS[goalType];
  const steps: Step[] = ["type", "value", "confirm"];
  const currentStepIndex = steps.indexOf(step);

  if (!checkedExisting) {
    return (
      <div
        className="min-h-[40vh] py-16"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      {/* Header */}
      <div className="mb-10 text-center">
        <div
          className="mx-auto mb-5 w-fit rounded-xl bg-gradient-to-br from-white/[0.2] via-white/[0.08] to-white/[0.03] p-px shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
          aria-hidden
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[11px] animate-logo-glow"
            style={{
              background:
                "linear-gradient(165deg, var(--bg-raised) 0%, var(--bg-card) 50%, #050505 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <svg
              className="h-6 w-6 drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id={moonGradId}
                  x1="5"
                  y1="4"
                  x2="19"
                  y2="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffffff" />
                  <stop offset="0.55" stopColor="#d4d4d4" />
                  <stop offset="1" stopColor="#737373" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${moonGradId})`}
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              />
            </svg>
          </div>
        </div>
        <h1
          className="text-3xl font-normal tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Welcome to Quran Coach
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Set your reading goal and we&apos;ll build a daily plan.
        </p>

        {/* Step indicator */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className="rounded-full transition-all duration-200"
              style={{
                height: "3px",
                width: step === s ? "20px" : "3px",
                background:
                  step === s
                    ? "var(--text)"
                    : currentStepIndex > i
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Step: type */}
      {step === "type" && (
        <div className="space-y-2.5 animate-fade-up">
          <p className="section-label mb-3">What&apos;s your goal?</p>
          {(Object.keys(GOAL_DESCRIPTIONS) as GoalType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="group w-full rounded-xl text-left transition-all duration-150"
              style={{
                padding: "1rem 1.25rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.background = "var(--bg-raised)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg-card)";
              }}
            >
              <span
                className="block font-medium text-sm"
                style={{ color: "var(--text)" }}
              >
                {type === "finish_in_days"
                  ? "Finish the Quran"
                  : "Memorise ayahs"}
              </span>
              <span
                className="mt-0.5 block text-sm"
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
              ((e.target as HTMLButtonElement).style.color = "var(--text)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.color = "var(--text-dim)")
            }
          >
            &larr; Back
          </button>
          <div
            className="rounded-xl p-5"
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
                    Math.max(
                      desc.min,
                      Math.min(desc.max, Number(e.target.value))
                    )
                  )
                }
                className="w-28 rounded-lg py-2 text-center text-2xl font-semibold focus:outline-none tabular-nums"
                style={{
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
              <span
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {desc.unit}
              </span>
            </div>
            {goalType === "finish_in_days" && (
              <p className="mt-4 text-xs" style={{ color: "var(--text-dim)" }}>
                That&apos;s roughly{" "}
                <span style={{ color: "var(--text-muted)" }}>
                  {Math.ceil(6236 / goalValue)} verses
                </span>{" "}
                per day (6,236 total).
              </p>
            )}
          </div>
          <button
            onClick={handleValueConfirm}
            className="btn-primary w-full py-2.5 text-sm"
          >
            Continue &rarr;
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
              ((e.target as HTMLButtonElement).style.color = "var(--text)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.color = "var(--text-dim)")
            }
          >
            &larr; Back
          </button>

          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
              Your goal
            </p>
            <p
              className="text-2xl font-normal tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {goalType === "finish_in_days"
                ? `Finish in ${goalValue} days`
                : `Memorise ${goalValue} ayahs / week`}
            </p>
            <div
              className="my-4 h-px mx-auto w-12"
              style={{ background: "var(--border)" }}
            />
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Starting{" "}
              {new Date().toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full py-2.5 text-sm"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent inline-block"
                  style={{
                    borderColor: "var(--accent-fg)",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Saving...
              </span>
            ) : (
              "Start my journey \u2192"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
