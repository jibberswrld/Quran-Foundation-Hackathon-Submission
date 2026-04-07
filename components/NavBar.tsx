import Link from "next/link";
import AuthNav from "@/components/AuthNav";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-emerald-700"
        >
          <span className="text-2xl">☽</span>
          <span>Quran Coach</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href="/dashboard" className="transition-colors hover:text-emerald-700">
            Dashboard
          </Link>
          <Link href="/read" className="transition-colors hover:text-emerald-700">
            Read
          </Link>
          <Link href="/onboarding" className="transition-colors hover:text-emerald-700">
            Goals
          </Link>
          <AuthNav />
        </div>
      </div>
    </nav>
  );
}
