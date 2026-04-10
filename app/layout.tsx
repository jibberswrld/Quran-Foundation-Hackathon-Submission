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
  icons: { icon: "/favicon.ico" },
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
          className="py-6 text-center text-xs animate-fade-in anim-delay-6"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-dim)",
          }}
        >
          Quran Coach &middot; Quran Foundation data (Quran.com API, same
          sources as{" "}
          <a
            href="https://mcp.quran.ai"
            className="underline-offset-2 hover:underline transition-colors"
            style={{ color: "var(--text-muted)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quran MCP
          </a>
          )
        </footer>
      </body>
    </html>
  );
}
