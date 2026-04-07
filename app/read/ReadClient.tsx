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
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/40 px-5 py-3">
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
      <div className="px-6 py-5 space-y-2.5 border-t border-zinc-800/50">
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
      setLoadState({ status: "error", message: "No reading goal set. Go to Goals to create one." });
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
    const updated = addReflection({ verseKey, reflection, savedAt: new Date().toISOString() });
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
          <div className="skeleton h-2.5 w-12 rounded" />
          <div className="flex-1 h-0.5 rounded-full bg-zinc-800" />
          <div className="skeleton h-2.5 w-10 rounded" />
        </div>
        <VerseCardSkeleton />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-6 text-sm text-red-400 space-y-3">
        <p>{loadState.message}</p>
        <button
          onClick={load}
          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
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
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-600">
          {activeIndex + 1} / {verses.length}
        </span>
        <div className="relative flex-1 h-0.5 rounded-full bg-zinc-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              boxShadow: "0 0 6px rgba(34,197,94,0.5)",
            }}
          />
        </div>
        <span className="text-xs text-zinc-600">{activeVerse.verseKey}</span>
      </div>

      {/* Verse nav dots */}
      {verses.length > 1 && (
        <div className="flex gap-1.5 justify-center">
          {verses.map((v, i) => (
            <button
              key={v.verseKey}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to verse ${v.verseKey}`}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? "h-1.5 w-4 bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                  : "h-1.5 w-1.5 bg-zinc-700 hover:bg-zinc-500"
              }`}
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
      <div className="flex gap-3 pt-1">
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
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-150 ${
            isComplete
              ? "cursor-default border border-zinc-800 bg-zinc-900 text-zinc-600"
              : "btn-primary"
          }`}
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
