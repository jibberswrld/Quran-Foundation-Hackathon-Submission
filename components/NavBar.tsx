import Link from "next/link";

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
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-base transition-all duration-300 group-hover:scale-105 animate-glow-pulse"
            style={{
              background: "linear-gradient(135deg, #c9a227 0%, #8f5500 100%)",
              boxShadow:
                "0 0 0 1px rgba(201,162,39,0.45), 0 4px 16px rgba(201,162,39,0.25)",
            }}
          >
            ☽
          </div>
          <span
            className="text-sm font-semibold tracking-wide transition-colors duration-200"
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
