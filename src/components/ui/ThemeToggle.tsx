import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

/** Small pill switch matching the reference UI — sun/moon, wired to the real site-wide theme. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-line-strong bg-surface px-1 transition-colors duration-200",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-canvas shadow-clay transition-transform duration-200 ease-editorial",
          isDark ? "translate-x-5" : "translate-x-0",
        )}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
