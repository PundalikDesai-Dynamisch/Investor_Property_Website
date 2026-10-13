"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "ppi:theme";

/** Light / dark switch. The first visit follows the system setting; a click stores an explicit choice. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    setDark(root.dataset.theme === "dark");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      try { if (localStorage.getItem(KEY)) return; } catch {}
      root.dataset.theme = mq.matches ? "dark" : "light";
      setDark(mq.matches);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);
  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch {}
    setDark(next === "dark");
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={dark} aria-label="Dark mode" title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-10 place-items-center rounded-sm text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink">
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
