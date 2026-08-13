import { useEffect, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * Drop-in GSAP scroll reveal for a grid/list: every direct match of
 * `selector` inside `containerRef` rises and fades in with a stagger as the
 * container scrolls into view. Re-runs whenever `deps` changes (e.g. once
 * live data has actually loaded and the real items exist in the DOM).
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>, selector: string, deps: unknown[] = []) {
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll(selector);
      if (items.length === 0) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
