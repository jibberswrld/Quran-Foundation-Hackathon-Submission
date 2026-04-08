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
        navy: {
          950: "#020c1a",
          900: "#071426",
          800: "#0c1d36",
          700: "#162844",
          600: "#1e3a5f",
          500: "#2a5280",
          400: "#4a7aaa",
          300: "#7aa5cc",
          200: "#a8c8e4",
          100: "#d4e6f5",
          50:  "#eaf2fa",
        },
        gold: {
          950: "#1a0f00",
          900: "#3d2400",
          800: "#6b3c00",
          700: "#8f5500",
          600: "#b07200",
          500: "#c9a227",
          400: "#ddb830",
          300: "#e8c96a",
          200: "#f0d988",
          100: "#f7eba8",
          50:  "#fdf6e0",
        },
        cream: {
          DEFAULT: "#ede8da",
          100: "#f8f4ec",
          200: "#f0e8d5",
          300: "#e4d5b8",
          400: "#cbb896",
          500: "#b09270",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
      },
      fontFamily: {
        arabic: ["Amiri", "Scheherazade New", "Traditional Arabic", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        "fade-in": "fadeIn 0.4s ease both",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(201, 162, 39, 0.15)" },
          "50%": { boxShadow: "0 0 28px rgba(201, 162, 39, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      boxShadow: {
        "gold-sm": "0 0 0 1px rgba(201,162,39,0.35), 0 4px 16px rgba(201,162,39,0.15)",
        "gold-md": "0 0 0 1px rgba(201,162,39,0.45), 0 4px 24px rgba(201,162,39,0.25)",
        "gold-lg": "0 0 0 1px rgba(201,162,39,0.55), 0 8px 36px rgba(201,162,39,0.35)",
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
