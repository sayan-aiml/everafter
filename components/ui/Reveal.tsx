"use client";

import { useEffect, useRef, type ReactNode } from "react";

declare global {
  interface Window {
    anime?: any;
  }
}

// Wraps a group of cards/rows and staggers them in with anime.js on mount.
// anime.js is loaded once from CDN in the root layout; if it hasn't loaded
// yet (or fails), children still render normally via the CSS fade-up
// fallback class — animation is progressive enhancement, never required.
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.anime) return;
    const targets = el.children;
    window.anime({
      targets,
      opacity: [0, 1],
      translateY: [10, 0],
      easing: "easeOutQuad",
      duration: 450,
      delay: window.anime.stagger(60),
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
