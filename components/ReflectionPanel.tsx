"use client";

import { useState, useEffect } from "react";
import type { Verse } from "@/lib/types";
import { fetchReflectionTafsir } from "@/lib/reflection";

interface ReflectionPanelProps {
  verse: Verse;
  /** When true (e.g. opened from a bookmark), show content expanded immediately */
  defaultExpanded?: boolean;
  /** Controlled mode: parent drives open/closed (e.g. “tap verse for reflection”) */
  expanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
}

type ReflectionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; text: string | null }
  | { status: "error"; message: string };

export default function ReflectionPanel({
  verse,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
}: ReflectionPanelProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded);
  const expanded =
    controlledExpanded !== undefined
      ? controlledExpanded
      : uncontrolledExpanded;
  const setExpanded = (open: boolean) => {
    onExpandedChange?.(open);
    if (controlledExpanded === undefined) setUncontrolledExpanded(open);
  };
  const [state, setState] = useState<ReflectionState>({ status: "idle" });

  useEffect(() => {
    if (controlledExpanded === undefined) {
      setUncontrolledExpanded(defaultExpanded);
    }
  }, [verse.verseKey, defaultExpanded, controlledExpanded]);

  useEffect(() => {
    if (verse.tafsir) {
      setState({ status: "ready", text: verse.tafsir });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    fetchReflectionTafsir(verse.verseKey)
      .then((text) => {
        if (!cancelled) setState({ status: "ready", text });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            status: "error",
            message:
              err instanceof Error ? err.message : "Could not load reflection.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [verse.verseKey, verse.tafsir]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl animate-fade-up anim-delay-3"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors"
        style={{ color: "var(--text)" }}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            style={{
              color: "var(--gold)",
              fontSize: "1rem",
              filter: "drop-shadow(0 0 6px rgba(201,162,39,0.5))",
            }}
          >
            ✦
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Reflection</h3>
            <p className="text-[11px] truncate" style={{ color: "var(--text-dim)" }}>
              Tafsir (Ibn Kathir, English) · Quran Foundation / Quran.com
            </p>
          </div>
        </div>
        <span className="text-xs tabular-nums shrink-0" style={{ color: "var(--text-dim)" }}>
          {expanded ? "Hide" : "Show"}
        </span>
      </button>

      {expanded && (
        <div
          className="border-t px-5 pb-5 pt-1 animate-fade-in"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {state.status === "loading" && (
            <div className="space-y-2 py-3">
              <div className="skeleton h-3.5 w-full" />
              <div className="skeleton h-3.5 w-[92%]" />
              <div className="skeleton h-3.5 w-[78%]" />
            </div>
          )}
          {state.status === "error" && (
            <p className="py-3 text-sm" style={{ color: "var(--red-text)" }}>
              {state.message}
            </p>
          )}
          {state.status === "ready" && !state.text && (
            <p className="py-3 text-sm" style={{ color: "var(--text-muted)" }}>
              No tafsir text is available for this verse in this resource.
            </p>
          )}
          {state.status === "ready" && state.text && (
            <div
              className="max-h-[min(28rem,55vh)] overflow-y-auto pr-1 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {state.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
