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
        className="pointer-events-none absolute -inset-1.5 rounded-xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(232, 182, 76, 0.45), transparent 65%)" }}
      />
      <div className="rounded-xl p-px transition-all duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(245, 207, 122, 0.45), rgba(124, 201, 169, 0.18) 55%, rgba(232, 182, 76, 0.05))",
        }}
      >
        <div
          className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[11px] animate-logo-glow"
          style={{
            background:
              "linear-gradient(165deg, #1a2430 0%, #0e151d 55%, #050a0f 100%)",
            boxShadow: "inset 0 1px 0 rgba(255, 235, 180, 0.12)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at 30% 25%, rgba(232, 182, 76, 0.22), transparent 60%)" }}
          />
          {/* Hover sheen */}
          <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100" />

          <svg
            className="relative z-10 h-[19px] w-[19px] drop-shadow-[0_0_10px_rgba(232,182,76,0.55)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-[8deg]"
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
                <stop stopColor="#fff3d1" />
                <stop offset="0.55" stopColor="#e8b64c" />
                <stop offset="1" stopColor="#8a5f14" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradId})`}
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          </svg>

          <span className="pointer-events-none absolute right-1 top-1 h-1 w-1 rounded-full" style={{ background: "#fff3d1", boxShadow: "0 0 6px rgba(255,243,209,0.9)" }} />
          <span className="pointer-events-none absolute bottom-1.5 left-1 h-px w-px rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
}
