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
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base text-emerald-400">✦</span>
        <h3 className="text-sm font-semibold text-zinc-100">AI Reflection</h3>
        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          Claude
        </span>
      </div>

      {/* Idle */}
      {state.status === "idle" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Generate a personalised reflection on this verse using Claude AI.
          </p>
          <button
            onClick={generateReflection}
            className="btn-primary w-full py-2.5 text-sm"
          >
            Generate reflection
          </button>
        </div>
      )}

      {/* Loading — skeleton */}
      {state.status === "loading" && (
        <div className="space-y-3 py-1">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-[90%]" />
          <div className="skeleton h-3.5 w-[75%]" />
          <div className="skeleton mt-2 h-3.5 w-[85%]" />
          <div className="skeleton h-3.5 w-[60%]" />
        </div>
      )}

      {/* Error */}
      {state.status === "error" && (
        <div className="space-y-3">
          <p className="rounded-xl border border-red-900/40 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {state.message}
          </p>
          <button
            onClick={generateReflection}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Try again →
          </button>
        </div>
      )}

      {/* Ready */}
      {state.status === "ready" && (
        <div className="space-y-4">
          <blockquote className="border-l-2 border-emerald-500/60 pl-4 text-sm italic leading-relaxed text-zinc-300">
            {state.reflection}
          </blockquote>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn-primary flex-1 py-2.5 text-sm"
            >
              Save reflection
            </button>
            <button
              onClick={generateReflection}
              className="btn-ghost px-4 py-2.5 text-sm"
            >
              ↺
            </button>
          </div>
        </div>
      )}

      {/* Saved */}
      {state.status === "saved" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <span>✓</span>
          <span>Reflection saved to your journal.</span>
        </div>
      )}
    </div>
  );
}
