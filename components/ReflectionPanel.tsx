"use client";

import { useState, useEffect } from "react";
import type { Verse } from "@/lib/types";
import { fetchReflectionTafsir } from "@/lib/reflection";

interface ReflectionPanelProps {
  verse: Verse;
  defaultExpanded?: boolean;
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
      className="overflow-hidden rounded-xl animate-fade-up anim-delay-3"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <h3
            className="text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Reflection
          </h3>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: "var(--text-dim)" }}
          >
            Tafsir Ibn Kathir &middot; Quran Foundation
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "var(--text-dim)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div
          className="border-t px-5 pb-5 pt-3 animate-fade-in"
          style={{ borderColor: "var(--border)" }}
        >
          {state.status === "loading" && (
            <div className="space-y-2 py-2">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-[90%]" />
              <div className="skeleton h-3 w-[75%]" />
            </div>
          )}
          {state.status === "error" && (
            <p className="py-2 text-sm" style={{ color: "var(--error)" }}>
              {state.message}
            </p>
          )}
          {state.status === "ready" && !state.text && (
            <p
              className="py-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No tafsir available for this verse.
            </p>
          )}
          {state.status === "ready" && state.text && (
            <div
              className="max-h-[min(28rem,55vh)] overflow-y-auto text-sm leading-relaxed"
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
