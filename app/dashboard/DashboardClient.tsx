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
        {/* Progress */}
        <section className="animate-fade-up anim-delay-1">
          <p className="section-label mb-4">Progress</p>
          <StreakTracker progress={mergedProgress} goal={userState.goal} />
          <Link
            href="/read"
            className="btn-primary mt-4 block w-full py-3 text-center text-sm"
          >
            Start today&apos;s reading →
          </Link>
        </section>

        {/* Bookmarks */}
        <section className="animate-fade-up anim-delay-2">
          <p className="section-label mb-4">Bookmarked Verses</p>

          {userState.bookmarks.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-2xl p-10 text-center"
              style={{
                border: "1px dashed rgba(255,255,255,0.1)",
                background: "rgba(7,20,38,0.5)",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-raised)",
                }}
              >
                🔖
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  No bookmarks yet
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-dim)" }}>
                  Star a verse while reading to save it here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {userState.bookmarks.map((b, i) => (
                <li
                  key={b.verseKey}
                  className="group relative overflow-hidden rounded-xl flex gap-3 items-start transition-all duration-200 animate-fade-up"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    padding: "0.875rem 1rem",
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="mb-1 section-label"
                      style={{ color: "var(--gold)" }}
                    >
                      {b.verseKey}
                    </p>
                    <p
                      className="text-sm italic line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      &ldquo;{b.translation}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(b.verseKey)}
                    aria-label={`Remove bookmark for ${b.verseKey}`}
                    className="flex-shrink-0 text-lg mt-0.5 transition-colors duration-150"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.color = "#f87171")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLButtonElement).style.color =
                        "var(--text-dim)")
                    }
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
        <section className="animate-fade-up anim-delay-3">
          <p className="section-label mb-5">Saved Reflections</p>
          <ul className="space-y-3">
            {userState.reflections.map((r, i) => (
              <li
                key={`${r.verseKey}-${r.savedAt}`}
                className="relative overflow-hidden rounded-2xl p-5 animate-fade-up"
                style={{
                  animationDelay: `${i * 80}ms`,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent)",
                  }}
                />
                <p
                  className="mb-3 flex items-center gap-2"
                  style={{ color: "var(--gold)" }}
                >
                  <span className="section-label" style={{ color: "var(--gold)" }}>
                    {r.verseKey}
                  </span>
                  <span
                    className="text-xs font-normal normal-case tracking-normal"
                    style={{ color: "var(--text-dim)" }}
                  >
                    ·{" "}
                    {new Date(r.savedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <blockquote
                  className="border-l-2 pl-4 text-sm italic leading-relaxed"
                  style={{
                    borderColor: "rgba(201,162,39,0.35)",
                    color: "var(--text-muted)",
                  }}
                >
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
