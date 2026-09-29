"use client";

import { useState, useEffect } from "react";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      if (typeof document !== "undefined" && document.body) {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
      }
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      if (typeof document !== "undefined" && document.body) {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("securevault_theme") as Theme | null;
    const initialTheme: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("securevault_theme", nextTheme);
    applyTheme(nextTheme);
  };

  return { theme, toggleTheme, mounted };
}
