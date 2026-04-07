import Link from "next/link";
import AuthNav from "@/components/AuthNav";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[15px] font-bold tracking-tight text-zinc-50 hover:text-white transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_4px_12px_rgba(34,197,94,0.2)]">
            ☽
          </span>
          Quran Coach
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Dashboard
          </Link>
          <Link
            href="/read"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Read
          </Link>
          <Link
            href="/onboarding"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Goals
          </Link>
        </div>

        {/* Auth */}
        <AuthNav />
      </div>
    </nav>
  );
}
