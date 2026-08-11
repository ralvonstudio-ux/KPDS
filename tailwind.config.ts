import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        canvas: "#F8F7F4",
        surface: "#FFFFFF",
        ink: "#111111",
        muted: "#6B7280",
        gold: {
          DEFAULT: "#C59D5F",
          soft: "#D9BE8C",
          deep: "#A9814A",
        },
        espresso: "#2B2118",
        line: "rgba(17, 17, 17, 0.08)",
        "line-strong": "rgba(17, 17, 17, 0.14)",
      },
      fontFamily: {
        sans: [
          "Geist Variable",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        // Editorial display sizes — reserved for hero/section moments only.
        "display-xl": ["clamp(3rem, 2.1rem + 4vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 1.9rem + 2.8vw, 4.5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 1.6rem + 1.8vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.5rem, 1.3rem + 0.9vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        section: "clamp(6rem, 4.5rem + 6vw, 10rem)",
      },
      borderRadius: {
        card: "24px",
        "card-lg": "32px",
      },
      boxShadow: {
        clay: "0 1px 2px rgba(43, 33, 24, 0.04), 0 12px 32px -12px rgba(43, 33, 24, 0.16)",
        "clay-lg": "0 4px 8px rgba(43, 33, 24, 0.04), 0 24px 60px -20px rgba(43, 33, 24, 0.22)",
        focus: "0 0 0 3px rgba(197, 157, 95, 0.45)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
