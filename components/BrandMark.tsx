"use client";

import { useId } from "react";

/**
 * Nav mark: subtle gradient frame + luminous moon — fits dark “Vercel-like” chrome.
 */
export default function BrandMark() {
  const gradId = `moon-${useId().replace(/:/g, "")}`;

  return (
    <div className="relative shrink-0" aria-hidden>
      {/* Outer halo — soft breathing light */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-br from-white/[0.12] via-transparent to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="rounded-lg bg-gradient-to-br from-white/[0.22] via-white/[0.08] to-white/[0.03] p-px shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-300 group-hover:from-white/[0.32] group-hover:via-white/[0.12] group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_24px_rgba(255,255,255,0.06)]">
        <div
          className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[7px] animate-logo-glow"
          style={{
            background:
              "linear-gradient(165deg, var(--bg-raised) 0%, var(--bg-card) 45%, #050505 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
          />
          {/* Hover sheen */}
          <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100" />

          <svg
            className="relative z-10 h-[18px] w-[18px] drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-rotate-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id={gradId}
                x1="5"
                y1="4"
                x2="19"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#e4e4e4" />
                <stop offset="1" stopColor="#9a9a9a" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradId})`}
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          </svg>

          <span className="pointer-events-none absolute right-1 top-1 h-0.5 w-0.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          <span className="pointer-events-none absolute bottom-1.5 left-1 h-px w-px rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}
