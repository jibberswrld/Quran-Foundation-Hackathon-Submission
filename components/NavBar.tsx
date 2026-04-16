import Link from "next/link";
import NavBrand from "@/components/NavBrand";

export default function NavBar() {
  return (
    <nav
      className="sticky top-0 z-30"
      style={{
        borderBottom: "1px solid var(--border)",
        background:
          "linear-gradient(180deg, rgba(11, 15, 20, 0.85), rgba(11, 15, 20, 0.65))",
        backdropFilter: "saturate(180%) blur(22px)",
        WebkitBackdropFilter: "saturate(180%) blur(22px)",
      }}
    >
      {/* Subtle gold hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232, 182, 76, 0.35), transparent)",
        }}
      />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavBrand />

        <div
          className="hidden sm:flex items-center gap-0.5 rounded-full px-1 py-1"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
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

        <Link
          href="/read"
          className="hidden sm:inline-flex btn-primary px-4 py-2 text-xs"
        >
          Read today
        </Link>
      </div>
    </nav>
  );
}
