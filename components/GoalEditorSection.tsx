"use client";

import { useState, useEffect } from "react";
import type { GoalType, UserGoal } from "@/lib/types";
import { GOAL_DESCRIPTIONS } from "@/lib/goal-constants";
import { loadGoal, saveGoal } from "@/lib/storage";
import { syncGoalToApi } from "@/lib/user";

export default function GoalEditorSection() {
  const [goalType, setGoalType] = useState<GoalType>("finish_in_days");
  const [goalValue, setGoalValue] = useState(365);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const g = loadGoal();
    if (g) {
      setGoalType(g.type);
      setGoalValue(g.value);
    }
  }, []);

  const desc = GOAL_DESCRIPTIONS[goalType];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const goal: UserGoal = {
      type: goalType,
      value: Math.min(desc.max, Math.max(desc.min, goalValue)),
      startedAt: loadGoal()?.startedAt ?? new Date().toISOString(),
    };

    saveGoal(goal);
    try {
      await syncGoalToApi(goal);
    } catch {
      /* local-first */
    }

    setSaving(false);
    setMessage("Reading goal saved.");
  }

  return (
    <section
      id="reading-goal"
      className="animate-fade-up anim-delay-1 mb-10 scroll-mt-24"
    >
      <p className="section-label mb-3">Reading goal</p>
      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-xl p-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Change how much you read each day.
        </p>

        <div className="flex flex-wrap gap-2">
          {(["finish_in_days", "memorize_per_week"] as GoalType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setGoalType(t);
                setGoalValue(GOAL_DESCRIPTIONS[t].defaultVal);
              }}
              className="rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
              style={{
                background:
                  goalType === t ? "var(--accent)" : "transparent",
                color:
                  goalType === t ? "var(--accent-fg)" : "var(--text-muted)",
                border: `1px solid ${
                  goalType === t ? "transparent" : "var(--border)"
                }`,
              }}
            >
              {t === "finish_in_days" ? "Finish Quran" : "Memorise"}
            </button>
          ))}
        </div>

        <div>
          <label
            className="mb-2 block text-xs font-medium"
            style={{ color: "var(--text-dim)" }}
          >
            {desc.label}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={desc.min}
              max={desc.max}
              value={goalValue}
              onChange={(e) => setGoalValue(Number(e.target.value))}
              className="input-field max-w-[8rem] tabular-nums"
            />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {desc.unit}
            </span>
          </div>
          <p className="mt-1.5 text-xs" style={{ color: "var(--text-dim)" }}>
            Between {desc.min} and {desc.max}.
          </p>
        </div>

        {message && (
          <p className="text-sm" style={{ color: "var(--success)" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save goal"}
        </button>
      </form>
    </section>
  );
}
