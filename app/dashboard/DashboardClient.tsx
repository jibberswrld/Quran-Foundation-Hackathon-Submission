"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LocalUserState } from "@/lib/types";
import { loadLocalUserState, removeBookmark } from "@/lib/storage";
import StreakTracker from "@/components/StreakTracker";
import { fetchRemoteStreak } from "@/lib/user";

export default function DashboardClient() {
  const [userState, setUserState] = useState<LocalUserState>({
    goal: null,
    progress: null,
    bookmarks: [],
    reflections: [],
  });
  const [remoteStreakDays, setRemoteStreakDays] = useState<number | null>(null);

  useEffect(() => {
    setUserState(loadLocalUserState());

    // Best-effort fetch of remote streak
    fetchRemoteStreak()
      .then((s) => {
        if (s) setRemoteStreakDays(s.current_streak);
      })
      .catch(() => {
        // Silently fall back to local streak
      });
  }, []);

  function handleRemoveBookmark(verseKey: string) {
    removeBookmark(verseKey);
    setUserState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.verseKey !== verseKey),
    }));
  }

  // Merge local and remote streak — remote wins if available
  const mergedProgress =
    userState.progress && remoteStreakDays !== null
      ? { ...userState.progress, streakDays: remoteStreakDays }
      : userState.progress;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Streak & progress */}
      <section>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Progress
        </h2>
        <StreakTracker progress={mergedProgress} goal={userState.goal} />
        <Link
          href="/read"
          className="mt-5 block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-2xl transition-colors"
        >
          Start today&apos;s reading →
        </Link>
      </section>

      {/* Bookmarks */}
      <section>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Bookmarked Verses
        </h2>

        {userState.bookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center text-stone-400 text-sm">
            No bookmarks yet. Star a verse while reading to save it here.
          </div>
        ) : (
          <ul className="space-y-3">
            {userState.bookmarks.map((b) => (
              <li
                key={b.verseKey}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 flex gap-3 items-start"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">
                    {b.verseKey}
                  </p>
                  <p className="text-sm text-stone-600 italic line-clamp-2">
                    &ldquo;{b.translation}&rdquo;
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(b.verseKey)}
                  aria-label={`Remove bookmark for ${b.verseKey}`}
                  className="text-stone-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Saved reflections */}
      {userState.reflections.length > 0 && (
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            Saved Reflections
          </h2>
          <ul className="space-y-3">
            {userState.reflections.map((r) => (
              <li
                key={`${r.verseKey}-${r.savedAt}`}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5"
              >
                <p className="text-xs font-semibold text-emerald-700 mb-2">
                  {r.verseKey} ·{" "}
                  {new Date(r.savedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <blockquote className="border-l-4 border-emerald-300 pl-4 text-stone-600 text-sm italic leading-7">
                  {r.reflection}
                </blockquote>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
