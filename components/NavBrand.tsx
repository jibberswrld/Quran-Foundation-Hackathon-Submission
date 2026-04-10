"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import BrandMark from "@/components/BrandMark";

/**
 * Home link with hover lift, underline, and a short springy press animation.
 */
export default function NavBrand() {
  const [tap, setTap] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = useCallback(() => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    setTap(false);
    requestAnimationFrame(() => setTap(true));
    tapTimer.current = setTimeout(() => {
      setTap(false);
      tapTimer.current = null;
    }, 520);
  }, []);

  return (
    <Link
      href="/"
      aria-label="Quran Coach home"
      onPointerDown={handlePointerDown}
      className={[
        "group relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 -mx-2 -my-1",
        "transition-all duration-300 ease-smooth",
        "hover:-translate-y-0.5 hover:bg-white/[0.05]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        tap ? "animate-brand-tap" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <BrandMark />
      <span className="relative text-sm font-medium tracking-tight text-white/90 transition-[letter-spacing,color,transform] duration-300 ease-smooth group-hover:tracking-[0.06em] group-hover:text-white group-hover:translate-x-px">
        Quran Coach
      </span>
      <span
        className="pointer-events-none absolute bottom-1 left-2 right-2 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-500 ease-smooth group-hover:scale-x-100"
        aria-hidden
      />
    </Link>
  );
}
