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
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">✨</span>
        <h3 className="font-semibold text-stone-800">AI Reflection</h3>
      </div>

      {state.status === "idle" && (
        <div className="space-y-3">
          <p className="text-sm text-stone-500">
            Generate a personalised reflection on this verse using Claude AI.
          </p>
          <button
            onClick={generateReflection}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            Generate reflection
          </button>
        </div>
      )}

      {state.status === "loading" && (
        <div className="flex items-center gap-3 text-sm text-stone-500 py-2">
          <span className="animate-spin inline-block">⟳</span>
          <span>Generating reflection…</span>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-3">
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
            {state.message}
          </p>
          <button
            onClick={generateReflection}
            className="text-sm text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {state.status === "ready" && (
        <div className="space-y-4">
          <blockquote className="border-l-4 border-emerald-400 pl-4 text-stone-700 text-sm leading-7 italic">
            {state.reflection}
          </blockquote>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
            >
              Save reflection
            </button>
            <button
              onClick={generateReflection}
              className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2.5 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}

      {state.status === "saved" && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl">
          <span>✓</span>
          <span>Reflection saved to your journal.</span>
        </div>
      )}
    </div>
  );
}
