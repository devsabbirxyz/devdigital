import { useEffect, useState } from "react";

type Theme = "dark" | "light";
const KEY = "theme";

function getInitial(): Theme {
  return "dark";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")), setTheme };
}

// Run before React mounts to avoid flash
if (typeof window !== "undefined") {
  apply(getInitial());
}