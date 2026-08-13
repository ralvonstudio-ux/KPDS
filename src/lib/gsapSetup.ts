import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, app-wide. Every page that wants scroll-linked choreography
// (parallax, pin, scrub-timelines) imports { gsap, ScrollTrigger } from here
// instead of "gsap" directly, so the plugin is guaranteed registered.
gsap.registerPlugin(ScrollTrigger);

/** True when the user has asked the OS for reduced motion — every GSAP
 * scroll-choreography helper below checks this and no-ops instead of
 * animating, matching the same rule already applied to Framer Motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
