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
    setMessage("Reading goal saved on this device.");
  }

  return (
    <section
      id="reading-goal"
      className="animate-fade-up anim-delay-1 mb-12 scroll-mt-24"
    >
      <p className="section-label mb-4">Reading goal</p>
      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Change how much you read each day. Your streak and daily assignment use this.
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
              className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: goalType === t ? "rgba(201,162,39,0.15)" : "transparent",
                border: `1px solid ${
                  goalType === t ? "rgba(201,162,39,0.45)" : "var(--border)"
                }`,
                color: goalType === t ? "var(--gold)" : "var(--text-muted)",
              }}
            >
              {t === "finish_in_days" ? "Finish Quran" : "Memorise"}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-dim)" }}>
            {desc.label}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={desc.min}
              max={desc.max}
              value={goalValue}
              onChange={(e) => setGoalValue(Number(e.target.value))}
              className="w-full max-w-[10rem] rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-raised)",
                color: "var(--text)",
              }}
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
          <p className="text-sm" style={{ color: "var(--gold)" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save goal"}
        </button>
      </form>
    </section>
  );
}
