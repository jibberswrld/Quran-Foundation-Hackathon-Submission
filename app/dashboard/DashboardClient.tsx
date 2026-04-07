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

    fetchRemoteStreak()
      .then((s) => {
        if (s) setRemoteStreakDays(s.current_streak);
      })
      .catch(() => {});
  }, []);

  function handleRemoveBookmark(verseKey: string) {
    removeBookmark(verseKey);
    setUserState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.verseKey !== verseKey),
    }));
  }

  const mergedProgress =
    userState.progress && remoteStreakDays !== null
      ? { ...userState.progress, streakDays: remoteStreakDays }
      : userState.progress;

  return (
    <div className="space-y-10">
      {/* Progress + CTA */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <p className="section-label mb-4">Progress</p>
          <StreakTracker progress={mergedProgress} goal={userState.goal} />
          <Link
            href="/read"
            className="btn-primary mt-5 block w-full py-3 text-center text-sm"
          >
            Start today&apos;s reading →
          </Link>
        </section>

        {/* Bookmarks */}
        <section>
          <p className="section-label mb-4">Bookmarked Verses</p>

          {userState.bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl">
                🔖
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">No bookmarks yet</p>
                <p className="mt-0.5 text-xs text-zinc-600">
                  Star a verse while reading to save it here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {userState.bookmarks.map((b) => (
                <li
                  key={b.verseKey}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 flex gap-3 items-start transition-colors hover:border-zinc-700"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                      {b.verseKey}
                    </p>
                    <p className="text-sm italic text-zinc-500 line-clamp-2">
                      &ldquo;{b.translation}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(b.verseKey)}
                    aria-label={`Remove bookmark for ${b.verseKey}`}
                    className="flex-shrink-0 text-zinc-700 transition-colors hover:text-red-400 text-lg mt-0.5"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Saved reflections */}
      {userState.reflections.length > 0 && (
        <section>
          <p className="section-label mb-4">Saved Reflections</p>
          <ul className="space-y-3">
            {userState.reflections.map((r) => (
              <li
                key={`${r.verseKey}-${r.savedAt}`}
                className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  {r.verseKey}
                  <span className="text-zinc-700 font-normal normal-case tracking-normal">
                    ·{" "}
                    {new Date(r.savedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <blockquote className="border-l-2 border-emerald-500/40 pl-4 text-sm italic leading-relaxed text-zinc-400">
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
