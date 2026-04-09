"use client";

import { useId } from "react";

/**
 * Nav / header mark: layered “medallion” with SVG crescent (replaces plain ☽ glyph).
 */
export default function BrandMark() {
  const moonGradId = `nav-moon-${useId().replace(/:/g, "")}`;

  return (
    <div
      className="relative flex h-9 w-9 shrink-0 items-center justify-center animate-logo-aura"
      aria-hidden
    >
      {/* Soft outer bloom */}
      <div
        className="pointer-events-none absolute inset-[-3px] rounded-2xl bg-gradient-to-br from-amber-300/25 via-amber-500/10 to-transparent opacity-80 blur-[3px]"
      />
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:-rotate-6"
        style={{
          background:
            "linear-gradient(145deg, #f7e8b8 0%, #e0bc3a 28%, #c9a227 52%, #8a5a0f 88%, #4a3208 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -3px 8px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,230,180,0.35), 0 0 0 1px rgba(60,40,10,0.6)",
        }}
      >
        {/* Top light + depth */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/35 via-transparent to-black/25" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] rounded-t-xl bg-gradient-to-b from-white/25 to-transparent" />
        {/* Specular glint — shifts on hover via group */}
        <div className="pointer-events-none absolute -left-[40%] top-0 h-full w-[70%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-[60%] group-hover:opacity-100" />

        <svg
          className="relative z-10 h-[19px] w-[19px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={moonGradId}
              x1="4"
              y1="3"
              x2="20"
              y2="21"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fffef9" />
              <stop offset="0.45" stopColor="#f5ecd8" />
              <stop offset="1" stopColor="#d4c4a8" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${moonGradId})`}
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          />
        </svg>

        {/* Accent “stars” */}
        <span className="pointer-events-none absolute right-[5px] top-[5px] h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.85)]" />
        <span className="pointer-events-none absolute bottom-[6px] left-[5px] h-[2px] w-[2px] rounded-full bg-amber-100/90 opacity-80" />
      </div>
    </div>
  );
}
