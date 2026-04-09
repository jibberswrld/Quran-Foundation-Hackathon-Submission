import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function NavBar() {
  return (
    <nav
      className="sticky top-0 z-30"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Quran Coach home"
        >
          <BrandMark />
          <span
            className="text-sm font-medium tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Quran Coach
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
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
