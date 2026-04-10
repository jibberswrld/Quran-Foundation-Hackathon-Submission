import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a0a",
          raised: "#161616",
          hover: "#1a1a1a",
        },
      },
      fontFamily: {
        arabic: ["Amiri", "Scheherazade New", "Traditional Arabic", "serif"],
        sans: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
        display: [
          "var(--font-newsreader)",
          "Newsreader",
          "Georgia",
          "serif",
        ],
      },
      animation: {
        "fade-up": "fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2s ease-in-out infinite",
        "logo-glow": "logoGlow 4s ease-in-out infinite",
        "brand-tap": "brandTap 0.48s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        logoGlow: {
          "0%, 100%": {
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 0 rgba(255,255,255,0)",
          },
          "50%": {
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 18px rgba(255,255,255,0.07)",
          },
        },
        brandTap: {
          "0%": { transform: "scale(1) translateY(0)" },
          "35%": { transform: "scale(0.93) translateY(1px)" },
          "65%": { transform: "scale(1.04) translateY(-2px)" },
          "100%": { transform: "scale(1) translateY(0)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
