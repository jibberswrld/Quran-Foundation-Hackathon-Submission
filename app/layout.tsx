import type { Metadata } from "next";
import { Outfit, Newsreader } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Quran Coach",
  description:
    "Your personal Quran reading companion — daily verses, scholarly reflection (tafsir), streaks, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`dark ${outfit.variable} ${newsreader.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer
          className="relative py-10 text-center text-xs animate-fade-in anim-delay-6"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-dim)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(232, 182, 76, 0.35), transparent)",
            }}
          />
          <p className="font-serif-italic text-sm" style={{ color: "var(--text-muted)" }}>
            &ldquo;The best of you are those who learn the Qur&rsquo;an and teach it.&rdquo;
          </p>
          <p className="mt-3">
            Quran Coach &middot; data via{" "}
            <a
              href="https://mcp.quran.ai"
              className="underline-offset-4 hover:underline transition-colors"
              style={{ color: "var(--gold-soft)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quran MCP
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
