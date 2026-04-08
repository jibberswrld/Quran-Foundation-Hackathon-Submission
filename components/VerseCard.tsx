"use client";

import type { Verse } from "@/lib/types";

interface VerseCardProps {
  verse: Verse;
  onBookmark?: (verse: Verse) => void;
  isBookmarked?: boolean;
  /** When set, the translation is tappable to jump to tafsir (daily read) */
  onShowTafsir?: () => void;
}

export default function VerseCard({
  verse,
  onBookmark,
  isBookmarked = false,
  onShowTafsir,
}: VerseCardProps) {
  return (
    <article
      className="animate-fade-up relative overflow-hidden rounded-2xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Gold top edge shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)",
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(2,12,26,0.45)",
        }}
      >
        <span
          className="section-label"
          style={{ color: "var(--gold)" }}
        >
          {verse.verseKey}
        </span>
        <div className="flex items-center gap-4">
          <div
            className="flex gap-3 text-xs"
            style={{ color: "var(--text-dim)" }}
          >
            <span>Juz {verse.juzNumber}</span>
            <span>Page {verse.pageNumber}</span>
          </div>
          {onBookmark && (
            <button
              onClick={() => onBookmark(verse)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
              className="text-xl transition-all duration-200 active:scale-90"
              style={{
                color: isBookmarked ? "var(--gold)" : "var(--text-dim)",
                filter: isBookmarked
                  ? "drop-shadow(0 0 6px rgba(201,162,39,0.6))"
                  : "none",
              }}
            >
              {isBookmarked ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>

      {/* Arabic text */}
      <div
        className="relative px-8 py-12 text-right"
        style={{
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(201,162,39,0.04) 0%, transparent 65%)",
        }}
      >
        <p
          className="arabic text-4xl sm:text-5xl"
          lang="ar"
          dir="rtl"
          style={{
            color: "var(--text)",
            textShadow: "0 0 40px rgba(201,162,39,0.08)",
          }}
        >
          {verse.arabicText}
        </p>
      </div>

      {/* Ornamental divider */}
      <div className="mx-6 flex items-center gap-3">
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent)",
          }}
        />
        <span style={{ color: "var(--text-dim)", fontSize: "0.6rem" }}>✦</span>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent)",
          }}
        />
      </div>

      {/* Translation */}
      <div className="px-6 py-5">
        {onShowTafsir ? (
          <button
            type="button"
            onClick={onShowTafsir}
            className="w-full rounded-xl text-left transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 -m-2 p-2"
          >
            <p
              className="text-[15px] italic leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              &ldquo;{verse.translation}&rdquo;
            </p>
            <p className="mt-2 text-xs font-medium" style={{ color: "var(--gold)" }}>
              Tap for tafsir →
            </p>
          </button>
        ) : (
          <p
            className="text-[15px] italic leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            &ldquo;{verse.translation}&rdquo;
          </p>
        )}
      </div>
    </article>
  );
}
