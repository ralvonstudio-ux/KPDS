import type { Config } from "tailwindcss";

// Every color below reads from a CSS custom property defined in
// src/styles/tokens.css, via the `rgb(var(--x) / <alpha-value>)` pattern —
// that's what makes `bg-canvas/80` etc. work AND makes dark mode a two-block
// swap of variable values rather than a `dark:` class on every component.
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

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
        obsidian: withOpacity("--color-obsidian"),
        bone: withOpacity("--color-bone"),
        "soft-white": withOpacity("--color-soft-white"),
        graphite: withOpacity("--color-graphite"),
        crimson: {
          DEFAULT: withOpacity("--color-crimson"),
          light: withOpacity("--color-crimson-light"),
        },
        wine: withOpacity("--color-wine"),
        ash: withOpacity("--color-ash"),

        // ---- Semantic aliases — every component in the app is written
        // against these names, so remapping the underlying CSS variables
        // (in tokens.css) re-themes the entire product — including dark
        // mode — from one place. New work should prefer the canonical
        // names above; these stay for the ~90 files already using them.
        canvas: withOpacity("--color-ivory"),
        surface: withOpacity("--color-ivory-soft"),
        ink: withOpacity("--color-ink"),
        muted: withOpacity("--color-muted"),
        gold: {
          DEFAULT: withOpacity("--color-coral"),
          soft: withOpacity("--color-coral-light"),
          deep: withOpacity("--color-coral-deep"),
        },
        espresso: {
          DEFAULT: withOpacity("--color-espresso"),
          deep: withOpacity("--color-espresso-deep"),
        },
        line: withOpacity("--color-line"),
        "line-strong": withOpacity("--color-line-strong"),
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
        // Editorial display serif — headings only, never body copy. Paired
        // with Geist Sans for everything else (nav, buttons, body text).
        serif: ["Lora Variable", "Lora", "Georgia", "serif"],
      },
      fontSize: {
        // Editorial display sizes — reserved for hero/section moments only.
        "display-xl": [
          "clamp(4.5rem, 2.6rem + 7vw, 7.5rem)", // 72px -> 120px
          { lineHeight: "0.9", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-lg": [
          "clamp(3rem, 2.3rem + 2.6vw, 4rem)", // 48px -> 64px
          { lineHeight: "1.05", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "display-md": [
          "clamp(2rem, 1.6rem + 1.8vw, 3.25rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "display-sm": [
          "clamp(1.375rem, 1.25rem + 0.6vw, 1.75rem)", // 22px -> 28px
          { lineHeight: "1.2", fontWeight: "500" },
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
        clay: "var(--shadow-clay)",
        "clay-lg": "var(--shadow-clay-lg)",
        focus: "var(--shadow-focus)",
        // Soft neumorphic depth — dual light+dark offset shadow, see the
        // annotated rationale in tokens.css. Used sparingly on a few
        // tactile panels, not a wholesale shadow-clay replacement.
        neu: "var(--shadow-neu)",
        "neu-coral": "var(--shadow-neu-coral)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
        // Snappy overshoot curve for small, fast, pressable interactions
        // (button hover/press, card lift) — editorial stays the default
        // for anything larger or slower.
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
