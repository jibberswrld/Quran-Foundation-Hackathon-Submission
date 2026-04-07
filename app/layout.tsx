import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Quran Coach",
  description:
    "Your personal Quran reading companion — daily verses, streaks, reflections, and progress tracking.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="py-4 text-center text-xs text-stone-400 border-t border-stone-200">
          © {new Date().getFullYear()} Quran Coach · Powered by Quran Foundation
          & Claude
        </footer>
      </body>
    </html>
  );
}
