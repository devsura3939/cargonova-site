"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_KEY = "cargonova-theme";

/**
 * Persist the theme in localStorage with a cookie fallback. Some embedded
 * webviews / private modes make localStorage flaky or throw on access; the
 * cookie keeps the choice stable so the theme never silently reverts.
 */
function readThemePref(): Theme | null {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch {
    /* storage blocked */
  }
  if (stored === "dark" || stored === "light") return stored;
  try {
    const m = document.cookie.match(/(?:^|;\s*)cargonova-theme=([^;]+)/);
    if (m && (m[1] === "dark" || m[1] === "light")) return m[1] as Theme;
  } catch {
    /* cookies blocked */
  }
  return null;
}

function writeThemePref(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage blocked — cookie below still persists */
  }
  try {
    document.cookie = `${THEME_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* cookies blocked */
  }
}

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "light",
  toggleTheme: () => {},
});

/** Script injected before paint to avoid theme flash. */
export const themeInitScript = `
(function () {
  try {
    var theme = null;
    try {
      var stored = localStorage.getItem("${THEME_KEY}");
      if (stored === "dark" || stored === "light") theme = stored;
    } catch (e) {}
    if (!theme) {
      try {
        var m = document.cookie.match(/(?:^|;\\s*)${THEME_KEY}=([^;]+)/);
        if (m && (m[1] === "dark" || m[1] === "light")) theme = m[1];
      } catch (e) {}
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    // Apply the persisted language pre-paint so Georgian typography rules
    // (html[lang="ka"]) take effect before hydration, not after.
    try {
      var storedLang = localStorage.getItem("cargonova-lang");
      if (storedLang === "ka" || storedLang === "en") {
        document.documentElement.lang = storedLang;
      }
    } catch (e) {}
  } catch (e) {}
})();
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Reading the persisted preference after mount keeps SSR markup stable.
    // The init script already applied the class before first paint.
    const pref = readThemePref();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = pref ?? (prefersDark ? "dark" : "light");
    // Re-assert synchronously (same commit as the class-toggle effect below) so
    // there is no flash between the init script and React taking over.
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.documentElement.setAttribute("data-theme", initial);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Persist on explicit user action only — never on mount, so a reload keeps
  // the stored theme instead of being overwritten by the initial state.
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      writeThemePref(next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
