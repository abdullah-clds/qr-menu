import { useEffect, useState } from "react";

const STORAGE_KEY = "menu-color-scheme";

function getInitialScheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage unavailable — fall back to system preference below.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useDarkMode() {
  const [scheme, setScheme] = useState(getInitialScheme);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // ignore — preference just won't persist across visits.
    }
  }, [scheme]);

  const toggle = () => setScheme((s) => (s === "dark" ? "light" : "dark"));

  return { scheme, isDark: scheme === "dark", toggle };
}
