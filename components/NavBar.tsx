import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-emerald-700 text-lg tracking-tight"
        >
          <span className="text-2xl">☽</span>
          <span>Quran Coach</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link
            href="/dashboard"
            className="hover:text-emerald-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/read"
            className="hover:text-emerald-700 transition-colors"
          >
            Read
          </Link>
          <Link
            href="/onboarding"
            className="hover:text-emerald-700 transition-colors"
          >
            Goals
          </Link>
        </div>
      </div>
    </nav>
  );
}
