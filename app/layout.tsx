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
    <html lang="en" dir="ltr" className="dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="py-5 text-center text-xs text-zinc-700 border-t border-zinc-900">
          © {new Date().getFullYear()} Quran Coach · Powered by Quran Foundation &amp; Claude
        </footer>
      </body>
    </html>
  );
}
