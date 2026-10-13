"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Fades content in once as it scrolls into view. Without JavaScript the content simply stays visible. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) return;
    el.setAttribute("data-armed", "");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute("data-in", ""); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={cn("reveal", className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}
