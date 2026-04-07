"use client";

import type { Verse } from "@/lib/types";

interface VerseCardProps {
  verse: Verse;
  onBookmark?: (verse: Verse) => void;
  isBookmarked?: boolean;
}

export default function VerseCard({
  verse,
  onBookmark,
  isBookmarked = false,
}: VerseCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/40 px-5 py-3">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          {verse.verseKey}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xs text-zinc-600">
            <span>Juz {verse.juzNumber}</span>
            <span>Page {verse.pageNumber}</span>
          </div>
          {onBookmark && (
            <button
              onClick={() => onBookmark(verse)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
              className={`text-lg transition-all duration-150 active:scale-90 ${
                isBookmarked
                  ? "text-emerald-400"
                  : "text-zinc-700 hover:text-zinc-400"
              }`}
            >
              {isBookmarked ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>

      {/* Arabic text — hero element */}
      <div
        className="relative px-8 py-10 text-right"
        style={{
          background:
            "radial-gradient(ellipse at 65% 50%, rgba(34,197,94,0.05) 0%, transparent 65%)",
        }}
      >
        <p
          className="arabic text-4xl text-zinc-100 sm:text-5xl"
          lang="ar"
          dir="rtl"
        >
          {verse.arabicText}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-zinc-800/50" />

      {/* Translation */}
      <div className="px-6 py-5">
        <p className="text-[15px] italic leading-relaxed text-zinc-400">
          &ldquo;{verse.translation}&rdquo;
        </p>
      </div>
    </article>
  );
}
