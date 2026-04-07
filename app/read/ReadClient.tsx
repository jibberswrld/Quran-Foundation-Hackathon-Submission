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
      // Mark the session complete
      const lastVerse = verses[verses.length - 1];
      const newProgress = updateProgress(lastVerse.verseKey, verses.length);
      setUserState((prev) => ({ ...prev, progress: newProgress }));
    }
  }

  if (loadState.status === "idle" || loadState.status === "loading") {
    return (
      <div className="flex items-center justify-center py-24 text-stone-400 text-sm gap-3">
        <span className="animate-spin inline-block">⟳</span>
        <span>Loading today&apos;s verses…</span>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700 space-y-3">
        <p>{loadState.message}</p>
        <button onClick={load} className="text-emerald-600 hover:underline text-sm">
          Retry
        </button>
      </div>
    );
  }

  const { verses } = loadState;
  const activeVerse = verses[activeIndex];
  const isComplete = userState.progress?.lastVerseKey === verses[verses.length - 1]?.verseKey;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>
          Verse {activeIndex + 1} of {verses.length}
        </span>
        <span>{activeVerse.verseKey}</span>
      </div>

      {/* Verse navigation dots */}
      {verses.length > 1 && (
        <div className="flex gap-1.5 justify-center flex-wrap">
          {verses.map((v, i) => (
            <button
              key={v.verseKey}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to verse ${v.verseKey}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? "bg-emerald-500" : "bg-stone-300"
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
      <div className="flex gap-3 pt-2">
        {activeIndex > 0 && (
          <button
            onClick={() => setActiveIndex((i) => i - 1)}
            className="flex-1 border border-stone-200 hover:border-stone-300 text-stone-600 text-sm font-medium py-3 rounded-2xl transition-colors"
          >
            ← Previous
          </button>
        )}
        <button
          onClick={() => handleNextVerse(verses)}
          className={`flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-2xl transition-colors ${
            isComplete ? "bg-stone-300 cursor-default" : ""
          }`}
          disabled={isComplete}
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
