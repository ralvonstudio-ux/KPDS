import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * Site-wide smooth scroll (Lenis), wired into GSAP's own ticker so
 * ScrollTrigger stays perfectly in sync with the smoothed scroll position
 * instead of drifting — the standard Lenis+GSAP integration pattern.
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

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    sharedLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }, []);

  return <>{children}</>;
}
