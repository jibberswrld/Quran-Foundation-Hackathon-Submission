"use client";

import type { Verse } from "@/lib/types";

interface VerseCardProps {
  verse: Verse;
  onBookmark?: (verse: Verse) => void;
  isBookmarked?: boolean;
  onShowReflection?: () => void;
}

export default function VerseCard({
  verse,
  onBookmark,
  isBookmarked = false,
  onShowReflection,
}: VerseCardProps) {
  return (
    <article
      className="animate-fade-up overflow-hidden rounded-xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: "var(--text)" }}
        >
          {verse.verseKey}
        </span>
        <div className="flex items-center gap-4">
          <div
            className="flex gap-3 text-xs tabular-nums"
            style={{ color: "var(--text-dim)" }}
          >
            <span>Juz {verse.juzNumber}</span>
            <span>Page {verse.pageNumber}</span>
          </div>
          {onBookmark && (
            <button
              onClick={() => onBookmark(verse)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
              className="transition-colors duration-150"
              style={{ color: isBookmarked ? "var(--text)" : "var(--text-dim)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Arabic text */}
      <div className="px-8 py-10 text-right">
        <p
          className="arabic text-3xl sm:text-4xl"
          lang="ar"
          dir="rtl"
          style={{ color: "var(--text)" }}
        >
          {verse.arabicText}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: "var(--border)" }} />

      {/* Translation */}
      <div className="px-5 py-4">
        {onShowReflection ? (
          <button
            type="button"
            onClick={onShowReflection}
            className="w-full text-left rounded-lg transition-colors hover:bg-white/[0.03] -m-1.5 p-1.5"
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              &ldquo;{verse.translation}&rdquo;
            </p>
            <p
              className="mt-2 text-xs font-medium"
              style={{ color: "var(--text)" }}
            >
              View reflection &rarr;
            </p>
          </button>
        ) : (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            &ldquo;{verse.translation}&rdquo;
          </p>
        )}
      </div>
    </article>
  );
}
