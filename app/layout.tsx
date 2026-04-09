import type { Metadata } from "next";
import { DM_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
      className={`dark ${dmSans.variable} ${cinzel.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer
          className="py-5 text-center text-xs border-t"
          style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
        >
          © {new Date().getFullYear()} Quran Coach · Quran Foundation data (Quran.com
          API, same sources as{" "}
          <a
            href="https://mcp.quran.ai"
            className="underline-offset-2 hover:underline"
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
