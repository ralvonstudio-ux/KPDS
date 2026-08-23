import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "kpds-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  // index.html already set the class synchronously before React mounted
  // (see the inline script there) — read it back rather than re-deriving
  // from localStorage/matchMedia, so the two can never disagree.
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Privacy mode / storage disabled — theme just won't persist across visits.
    }
  }, [theme]);

  // Follow the OS setting for a visitor who hasn't made an explicit choice
  // on this device yet.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setThemeState(e.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
