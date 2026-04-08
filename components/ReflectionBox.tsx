"use client";

import { useState } from "react";
import type { Verse, ClaudeReflectionResponse } from "@/lib/types";

interface ReflectionBoxProps {
  verse: Verse;
  onSave?: (verseKey: string, reflection: string) => void;
}

type ReflectionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; reflection: string }
  | { status: "saved" }
  | { status: "error"; message: string };

export default function ReflectionBox({ verse, onSave }: ReflectionBoxProps) {
  const [state, setState] = useState<ReflectionState>({ status: "idle" });

  async function generateReflection() {
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verseKey: verse.verseKey,
          arabicText: verse.arabicText,
          translation: verse.translation,
          tafsir: verse.tafsir ?? null,
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as ClaudeReflectionResponse;
      setState({ status: "ready", reflection: data.reflection });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  function handleSave() {
    if (state.status !== "ready") return;
    onSave?.(verse.verseKey, state.reflection);
    setState({ status: "saved" });
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 animate-fade-up anim-delay-3"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />

      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <span
          style={{
            color: "var(--gold)",
            fontSize: "1rem",
            filter: "drop-shadow(0 0 6px rgba(201,162,39,0.5))",
          }}
        >
          ✦
        </span>
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--text)" }}
        >
          AI Reflection
        </h3>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{
            border: "1px solid rgba(201,162,39,0.3)",
            background: "rgba(201,162,39,0.08)",
            color: "var(--gold)",
          }}
        >
          Claude
        </span>
      </div>

      {/* Idle */}
      {state.status === "idle" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Generate a personalised reflection on this verse using Claude AI.
          </p>
          <button onClick={generateReflection} className="btn-primary w-full py-2.5 text-sm">
            Generate reflection
          </button>
        </div>
      )}

      {/* Loading */}
      {state.status === "loading" && (
        <div className="space-y-3 py-1">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="h-4 w-4 rounded-full border-2 border-t-transparent"
              style={{
                borderColor: "var(--gold)",
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              Reflecting on {verse.verseKey}…
            </span>
          </div>
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-[92%]" />
          <div className="skeleton h-3.5 w-[78%]" />
          <div className="skeleton mt-2 h-3.5 w-[88%]" />
          <div className="skeleton h-3.5 w-[62%]" />
        </div>
      )}

      {/* Error */}
      {state.status === "error" && (
        <div className="space-y-3">
          <p
            className="rounded-xl border px-4 py-3 text-sm"
            style={{
              borderColor: "var(--red-border)",
              background: "var(--red-bg)",
              color: "var(--red-text)",
            }}
          >
            {state.message}
          </p>
          <button
            onClick={generateReflection}
            className="text-sm transition-colors"
            style={{ color: "var(--gold)" }}
          >
            Try again →
          </button>
        </div>
      )}

      {/* Ready */}
      {state.status === "ready" && (
        <div className="space-y-4 animate-fade-in">
          <blockquote
            className="border-l-2 pl-4 text-sm italic leading-relaxed"
            style={{
              borderColor: "rgba(201,162,39,0.5)",
              color: "var(--text-muted)",
            }}
          >
            {state.reflection}
          </blockquote>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1 py-2.5 text-sm">
              Save reflection
            </button>
            <button
              onClick={generateReflection}
              className="btn-ghost px-4 py-2.5 text-sm"
              title="Regenerate"
            >
              ↺
            </button>
          </div>
        </div>
      )}

      {/* Saved */}
      {state.status === "saved" && (
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm animate-fade-in"
          style={{
            borderColor: "rgba(201,162,39,0.25)",
            background: "rgba(201,162,39,0.07)",
            color: "var(--gold)",
          }}
        >
          <span>✓</span>
          <span>Reflection saved to your journal.</span>
        </div>
      )}
    </div>
  );
}
