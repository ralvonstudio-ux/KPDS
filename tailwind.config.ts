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
        // ---- Canonical palette (docs/design-system.md) ----
        obsidian: "#0B0B0C",
        bone: "#F4F2ED",
        "soft-white": "#FAF9F6",
        graphite: "#666568",
        crimson: { DEFAULT: "#A51D2D", light: "#C13A4C" },
        wine: "#641722",
        ash: "#DDD9D2",

        // ---- Semantic aliases — every component in the app is written
        // against these names, so remapping them here re-themes the entire
        // product (public site, shop, both dashboards) from one place.
        // New work should prefer the canonical names above; these stay for
        // the ~90 files already using them. ----
        canvas: "#F4F2ED", // = bone
        surface: "#FAF9F6", // = soft-white
        ink: "#111113",
        muted: "#666568", // = graphite
        gold: { DEFAULT: "#A51D2D", soft: "#C13A4C", deep: "#641722" }, // = crimson / crimson-light / wine
        espresso: "#0B0B0C", // = obsidian
        line: "#DDD9D2", // = ash
        "line-strong": "#C7C1B4",
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
        "display-xl": [
          "clamp(4.5rem, 2.6rem + 7vw, 7.5rem)", // 72px -> 120px
          { lineHeight: "0.9", letterSpacing: "-0.06em", fontWeight: "500" },
        ],
        "display-lg": [
          "clamp(3rem, 2.3rem + 2.6vw, 4rem)", // 48px -> 64px
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
        "display-md": [
          "clamp(2rem, 1.6rem + 1.8vw, 3.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-sm": [
          "clamp(1.375rem, 1.25rem + 0.6vw, 1.75rem)", // 22px -> 28px
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        eyebrow: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "500" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        section: "clamp(6rem, 4.5rem + 6vw, 10rem)",
      },
      borderRadius: {
        sm: "12px",
        card: "20px",
        "card-lg": "28px",
        hero: "36px",
      },
      boxShadow: {
        clay: "0 12px 40px rgba(11, 11, 12, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        "clay-lg": "0 24px 70px rgba(11, 11, 12, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        focus: "0 0 0 3px rgba(165, 29, 45, 0.35)",
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
