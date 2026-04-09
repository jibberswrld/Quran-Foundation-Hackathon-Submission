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
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Progress */}
        <section className="animate-fade-up anim-delay-1">
          <p className="section-label mb-3">Progress</p>
          <StreakTracker progress={mergedProgress} goal={userState.goal} />
          <Link
            href="/read"
            className="btn-primary mt-4 block w-full py-2.5 text-center text-sm"
          >
            Start today&apos;s reading &rarr;
          </Link>
        </section>

        {/* Bookmarks */}
        <section className="animate-fade-up anim-delay-2">
          <p className="section-label mb-3">Bookmarked verses</p>

          {userState.bookmarks.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-xl p-10 text-center"
              style={{
                border: "1px dashed var(--border)",
                background: "var(--bg-card)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                No bookmarks yet
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Star a verse while reading to save it here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {userState.bookmarks.map((b, i) => (
                <li
                  key={b.verseKey}
                  className="group overflow-hidden rounded-xl flex gap-3 items-start transition-all duration-150 animate-fade-up"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <Link
                    href={`/read?verse=${encodeURIComponent(b.verseKey)}`}
                    className="flex-1 min-w-0 text-left rounded-md -m-1 p-1 transition-colors hover:bg-white/[0.03]"
                  >
                    <p
                      className="mb-1 text-xs font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {b.verseKey}
                    </p>
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      &ldquo;{b.translation}&rdquo;
                    </p>
                    <p
                      className="mt-1.5 text-xs"
                      style={{ color: "var(--text-dim)" }}
                    >
                      Open verse &rarr;
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveBookmark(b.verseKey);
                    }}
                    aria-label={`Remove bookmark for ${b.verseKey}`}
                    className="flex-shrink-0 mt-0.5 transition-colors duration-150"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.color =
                        "var(--error)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLButtonElement).style.color =
                        "var(--text-dim)")
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
