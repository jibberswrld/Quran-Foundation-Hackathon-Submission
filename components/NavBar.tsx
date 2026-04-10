import Link from "next/link";
import NavBrand from "@/components/NavBrand";

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
        <NavBrand />

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
