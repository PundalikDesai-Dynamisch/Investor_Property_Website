"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

type Key = "ppi:saved" | "ppi:compare";
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
};
const read = (key: Key) => { try { return localStorage.getItem(key) ?? "[]"; } catch { return "[]"; } };

/** A small list of slugs kept in localStorage (saved homes, compare tray). */
export function useIdList(key: Key, max = 99) {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => "[]");
  const ids = useMemo<string[]>(() => { try { return JSON.parse(raw); } catch { return []; } }, [raw]);
  const toggle = useCallback((id: string) => {
    const cur: string[] = JSON.parse(read(key));
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-max);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* private mode */ }
    listeners.forEach((l) => l());
  }, [key, max]);
  const clear = useCallback(() => { try { localStorage.setItem(key, "[]"); } catch {} listeners.forEach((l) => l()); }, [key]);
  return { ids, has: (id: string) => ids.includes(id), toggle, clear };
}
