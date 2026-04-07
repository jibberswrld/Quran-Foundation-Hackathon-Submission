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
    <article className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-emerald-50 border-b border-emerald-100">
        <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
          {verse.verseKey}
        </span>

        {onBookmark && (
          <button
            onClick={() => onBookmark(verse)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
            className={`text-lg transition-transform active:scale-90 ${
              isBookmarked ? "text-emerald-600" : "text-stone-300 hover:text-emerald-500"
            }`}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        )}
      </div>

      {/* Arabic */}
      <div className="px-6 py-6 text-right">
        <p
          className="arabic text-3xl text-stone-800 leading-[2.2]"
          lang="ar"
          dir="rtl"
        >
          {verse.arabicText}
        </p>
      </div>

      {/* Divider */}
      <hr className="mx-6 border-stone-100" />

      {/* Translation */}
      <div className="px-6 py-5">
        <p className="text-stone-600 text-base leading-7 italic">
          &ldquo;{verse.translation}&rdquo;
        </p>
      </div>

      {/* Meta */}
      <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex gap-4 text-xs text-stone-400">
        <span>Juz {verse.juzNumber}</span>
        <span>Page {verse.pageNumber}</span>
      </div>
    </article>
  );
}
