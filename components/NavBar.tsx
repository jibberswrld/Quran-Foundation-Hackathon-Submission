import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function NavBar() {
  return (
    <nav
      className="sticky top-0 z-30"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(2, 12, 26, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Quran Coach home"
        >
          <BrandMark />
          <span
            className="text-sm font-semibold tracking-wide transition-all duration-300 group-hover:tracking-[0.06em]"
            style={{
              fontFamily: "var(--font-cinzel), Cinzel, serif",
              color: "var(--text)",
            }}
          >
            Quran Coach
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-0.5">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/read", label: "Read" },
            { href: "/settings#reading-goal", label: "Settings" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="nav-link">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
