"use client";

import { useState, useEffect, useCallback } from "react";
import type { Verse, LocalUserState } from "@/lib/types";
import { loadLocalUserState, addBookmark, addReflection, updateProgress } from "@/lib/storage";
import { computeTodayVerseRange } from "@/lib/quran";
import { fetchVerses } from "@/lib/quran";
import VerseCard from "@/components/VerseCard";
import AudioPlayer from "@/components/AudioPlayer";
import ReflectionBox from "@/components/ReflectionBox";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; verses: Verse[] }
  | { status: "error"; message: string };

function VerseCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl animate-fade-in"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(2,12,26,0.45)",
        }}
      >
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-24" />
      </div>
      {/* arabic block */}
      <div className="px-8 py-10 space-y-4">
        <div className="skeleton h-8 w-[85%] ml-auto" />
        <div className="skeleton h-8 w-[70%] ml-auto" />
        <div className="skeleton h-8 w-[50%] ml-auto" />
      </div>
      {/* translation */}
      <div className="px-6 py-5 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-[88%]" />
        <div className="skeleton h-3.5 w-[72%]" />
      </div>
    </div>
  );
}

export default function ReadClient() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [userState, setUserState] = useState<LocalUserState>({
    goal: null,
    progress: null,
    bookmarks: [],
    reflections: [],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    const state = loadLocalUserState();
    setUserState(state);

    if (!state.goal) {
      setLoadState({
        status: "error",
        message: "No reading goal set. Go to Goals to create one.",
      });
      return;
    }

    try {
      const range = computeTodayVerseRange(state.goal, state.progress);
      const verses = await fetchVerses(range.chapterId, range.verseFrom, range.verseTo);
      setLoadState({ status: "ready", verses });
    } catch (err) {
      setLoadState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load verses.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleBookmark(verse: Verse) {
    const isAlreadyBookmarked = userState.bookmarks.some(
      (b) => b.verseKey === verse.verseKey
    );
    if (isAlreadyBookmarked) return;

    const updated = addBookmark({
      verseKey: verse.verseKey,
      arabicText: verse.arabicText,
      translation: verse.translation,
      savedAt: new Date().toISOString(),
    });
    setUserState((prev) => ({ ...prev, bookmarks: updated }));
  }

  function handleSaveReflection(verseKey: string, reflection: string) {
    const updated = addReflection({
      verseKey,
      reflection,
      savedAt: new Date().toISOString(),
    });
    setUserState((prev) => ({ ...prev, reflections: updated }));
  }

  function handleNextVerse(verses: Verse[]) {
    if (activeIndex < verses.length - 1) {
      setActiveIndex((i) => i + 1);
    } else {
      const lastVerse = verses[verses.length - 1];
      const newProgress = updateProgress(lastVerse.verseKey, verses.length);
      setUserState((prev) => ({ ...prev, progress: newProgress }));
    }
  }

  if (loadState.status === "idle" || loadState.status === "loading") {
    return (
      <div className="space-y-5">
        {/* Progress bar skeleton */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-3 w-12 rounded" />
          <div
            className="flex-1 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div className="skeleton h-3 w-10 rounded" />
        </div>
        <VerseCardSkeleton />
        <div className="skeleton h-14 w-full rounded-2xl" />
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div
        className="rounded-2xl border p-6 text-sm space-y-3 animate-fade-in"
        style={{
          borderColor: "var(--red-border)",
          background: "var(--red-bg)",
          color: "var(--red-text)",
        }}
      >
        <p>{loadState.message}</p>
        <button
          onClick={load}
          className="text-sm transition-colors"
          style={{ color: "var(--gold)" }}
        >
          Retry →
        </button>
      </div>
    );
  }

  const { verses } = loadState;
  const activeVerse = verses[activeIndex];
  const isComplete =
    userState.progress?.lastVerseKey === verses[verses.length - 1]?.verseKey;
  const progressPct = ((activeIndex + 1) / verses.length) * 100;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3 animate-fade-up">
        <span className="text-xs tabular-nums" style={{ color: "var(--text-dim)" }}>
          {activeIndex + 1} / {verses.length}
        </span>
        <div
          className="relative flex-1 h-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #c9a227, #e8c96a)",
              boxShadow: "0 0 8px rgba(201,162,39,0.5)",
            }}
          />
        </div>
        <span className="text-xs" style={{ color: "var(--text-dim)" }}>
          {activeVerse.verseKey}
        </span>
      </div>

      {/* Verse nav dots */}
      {verses.length > 1 && (
        <div className="flex gap-1.5 justify-center animate-fade-up anim-delay-1">
          {verses.map((v, i) => (
            <button
              key={v.verseKey}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to verse ${v.verseKey}`}
              className="rounded-full transition-all duration-300"
              style={{
                height: "6px",
                width: i === activeIndex ? "18px" : "6px",
                background:
                  i === activeIndex
                    ? "linear-gradient(90deg, #c9a227, #e8c96a)"
                    : "rgba(255,255,255,0.15)",
                boxShadow:
                  i === activeIndex
                    ? "0 0 8px rgba(201,162,39,0.6)"
                    : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Verse card */}
      <VerseCard
        verse={activeVerse}
        onBookmark={handleBookmark}
        isBookmarked={userState.bookmarks.some(
          (b) => b.verseKey === activeVerse.verseKey
        )}
      />

      {/* Audio */}
      {activeVerse.audioUrl && (
        <AudioPlayer
          audioUrl={activeVerse.audioUrl}
          verseKey={activeVerse.verseKey}
        />
      )}

      {/* Reflection */}
      <ReflectionBox verse={activeVerse} onSave={handleSaveReflection} />

      {/* Navigation */}
      <div className="flex gap-3 pt-1 animate-fade-up anim-delay-4">
        {activeIndex > 0 && (
          <button
            onClick={() => setActiveIndex((i) => i - 1)}
            className="btn-ghost flex-1 py-3 text-sm font-medium"
          >
            ← Previous
          </button>
        )}
        <button
          onClick={() => handleNextVerse(verses)}
          disabled={isComplete}
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
            isComplete ? "" : "btn-primary"
          }`}
          style={
            isComplete
              ? {
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)",
                  cursor: "default",
                  borderRadius: "0.75rem",
                }
              : {}
          }
        >
          {activeIndex < verses.length - 1
            ? "Next verse →"
            : isComplete
            ? "Session complete ✓"
            : "Complete session →"}
        </button>
      </div>
    </div>
  );
}
