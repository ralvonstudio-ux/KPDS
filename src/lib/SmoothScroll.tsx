import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide smooth scroll. Uses Lenis's own built-in `autoRaf` loop rather
 * than GSAP's ticker — nothing in the app creates GSAP ScrollTrigger
 * instances any more (the cinematic scroll-driven homepage that needed it
 * was replaced by the conventional layout), so wiring through GSAP just to
 * drive Lenis's raf loop was pulling the entire GSAP + ScrollTrigger
 * bundle — the single largest chunk of the main bundle — into every page
 * for no actual animation. Dropping it here removed that dependency
 * entirely; see git history if scroll-linked GSAP choreography is ever
 * needed again.
 *
 * Skips itself entirely under prefers-reduced-motion: native scroll behaves
 * exactly as a reduced-motion user expects, no smoothing layer at all.
 *
 * Module-level singleton, created at most once and never torn down. React
 * 18 StrictMode double-invokes effects in development (mount -> cleanup ->
 * mount again, synchronously) — a naive create-in-effect/destroy-in-cleanup
 * implementation transiently ends up with two Lenis instances both attached
 * to `window`, each treating the other's corrective scrollTo as new user
 * input, compounding into a runaway auto-scroll within a couple of seconds.
 * That's exactly the "page scrolls itself for no reason" bug this guard
 * fixes. Since this component wraps the whole tree at the App root and is
 * never intentionally unmounted for the app's real lifetime, "create once,
 * never destroy" is the correct fix here, not a workaround — there is no
 * real unmount for a from-then-on cleanup to ever need to handle.
 */
let sharedLenis: Lenis | null = null;

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion() || sharedLenis) return;

    sharedLenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });
  }, []);

  return <>{children}</>;
}
