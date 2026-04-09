"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Verse, LocalUserState } from "@/lib/types";
import { loadLocalUserState, addBookmark, updateProgress } from "@/lib/storage";
import {
  computeTodayVerseRange,
  fetchVerses,
  fetchVerseByKey,
} from "@/lib/quran";
import VerseCard from "@/components/VerseCard";
import AudioPlayer from "@/components/AudioPlayer";
import ReflectionPanel from "@/components/ReflectionPanel";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; verses: Verse[] }
  | { status: "focus"; verse: Verse }
  | { status: "error"; message: string };

function parseVerseKey(raw: string | null): string | null {
  if (!raw) return null;
  const t = raw.trim();
  return /^\d{1,3}:\d{1,3}$/.test(t) ? t : null;
}

function VerseCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl animate-fade-in"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="skeleton h-3 w-14" />
        <div className="skeleton h-3 w-20" />
      </div>
      <div className="px-8 py-10 space-y-4">
        <div className="skeleton h-7 w-[85%] ml-auto" />
        <div className="skeleton h-7 w-[70%] ml-auto" />
        <div className="skeleton h-7 w-[50%] ml-auto" />
      </div>
      <div
        className="px-5 py-4 space-y-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-[85%]" />
        <div className="skeleton h-3 w-[70%]" />
      </div>
    </div>
  );
}

export default function ReadClient() {
  const searchParams = useSearchParams();
  const verseParam = searchParams.get("verse");
  const focusKey = useMemo(() => parseVerseKey(verseParam), [verseParam]);

  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [userState, setUserState] = useState<LocalUserState>({
    goal: null,
    progress: null,
    bookmarks: [],
    reflections: [],
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const reflectionAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReflectionOpen(false);
  }, [activeIndex]);

  function scrollToReflection() {
    setReflectionOpen(true);
    requestAnimationFrame(() => {
      reflectionAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    const state = loadLocalUserState();
    setUserState(state);

    if (focusKey) {
      try {
        const verse = await fetchVerseByKey(focusKey);
        setLoadState({ status: "focus", verse });
      } catch (err) {
        setLoadState({
          status: "error",
          message:
            err instanceof Error ? err.message : "Failed to load that verse.",
        });
      }
      return;
    }

    if (!state.goal) {
      setLoadState({
        status: "error",
        message: "No reading goal set. Add one in Settings.",
      });
      return;
    }

    try {
      const range = computeTodayVerseRange(state.goal, state.progress);
      const verses = await fetchVerses(
        range.chapterId,
        range.verseFrom,
        range.verseTo
      );
      setLoadState({ status: "ready", verses });
    } catch (err) {
      setLoadState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load verses.",
      });
    }
  }, [focusKey]);

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
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-3 w-12 rounded" />
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border)" }}
          />
          <div className="skeleton h-3 w-10 rounded" />
        </div>
        <VerseCardSkeleton />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div
        className="rounded-xl p-5 text-sm space-y-3 animate-fade-in"
        style={{
          border: "1px solid var(--error-border)",
          background: "var(--error-bg)",
          color: "var(--error)",
        }}
      >
        <p>{loadState.message}</p>
        <button
          onClick={load}
          className="text-sm font-medium transition-colors hover:underline"
          style={{ color: "var(--text)" }}
        >
          Retry &rarr;
        </button>
      </div>
    );
  }

  if (loadState.status === "focus") {
    const v = loadState.verse;
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="font-medium" style={{ color: "var(--text)" }}>
              {v.verseKey}
            </span>
            <span className="mx-2" style={{ color: "var(--text-dim)" }}>
              /
            </span>
            Bookmarked verse
          </p>
          <Link
            href="/read"
            className="btn-primary py-2 px-4 text-sm"
          >
            Today&apos;s reading &rarr;
          </Link>
        </div>

        <VerseCard
          verse={v}
          onBookmark={handleBookmark}
          isBookmarked={userState.bookmarks.some(
            (b) => b.verseKey === v.verseKey
          )}
        />

        {v.audioUrl && (
          <AudioPlayer audioUrl={v.audioUrl} verseKey={v.verseKey} />
        )}

        <ReflectionPanel verse={v} defaultExpanded />
      </div>
    );
  }

  const { verses } = loadState;
  const activeVerse = verses[activeIndex];
  const isComplete =
    userState.progress?.lastVerseKey === verses[verses.length - 1]?.verseKey;
  const progressPct = ((activeIndex + 1) / verses.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 animate-fade-up">
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--text-dim)" }}
        >
          {activeIndex + 1}/{verses.length}
        </span>
        <div
          className="relative flex-1 h-px"
          style={{ background: "var(--border)" }}
        >
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              height: "2px",
              top: "-0.5px",
              background: "var(--text)",
            }}
          />
        </div>
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--text-dim)" }}
        >
          {activeVerse.verseKey}
        </span>
      </div>

      {/* Dot indicators */}
      {verses.length > 1 && (
        <div className="flex gap-1 justify-center animate-fade-up anim-delay-1">
          {verses.map((verse, i) => (
            <button
              key={verse.verseKey}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to verse ${verse.verseKey}`}
              className="rounded-full transition-all duration-200"
              style={{
                height: "4px",
                width: i === activeIndex ? "16px" : "4px",
                background:
                  i === activeIndex
                    ? "var(--text)"
                    : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      )}

      <VerseCard
        verse={activeVerse}
        onBookmark={handleBookmark}
        isBookmarked={userState.bookmarks.some(
          (b) => b.verseKey === activeVerse.verseKey
        )}
        onShowReflection={scrollToReflection}
      />

      {activeVerse.audioUrl && (
        <AudioPlayer
          audioUrl={activeVerse.audioUrl}
          verseKey={activeVerse.verseKey}
        />
      )}

      <div ref={reflectionAnchorRef}>
        <ReflectionPanel
          verse={activeVerse}
          expanded={reflectionOpen}
          onExpandedChange={setReflectionOpen}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-1 animate-fade-up anim-delay-4">
        {activeIndex > 0 && (
          <button
            onClick={() => setActiveIndex((i) => i - 1)}
            className="btn-ghost flex-1 py-2.5 text-sm"
          >
            &larr; Previous
          </button>
        )}
        <button
          onClick={() => handleNextVerse(verses)}
          disabled={isComplete}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
            isComplete ? "" : "btn-primary"
          }`}
          style={
            isComplete
              ? {
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)",
                  cursor: "default",
                }
              : {}
          }
        >
          {activeIndex < verses.length - 1
            ? "Next verse \u2192"
            : isComplete
              ? "Session complete"
              : "Complete session \u2192"}
        </button>
      </div>
    </div>
  );
}
