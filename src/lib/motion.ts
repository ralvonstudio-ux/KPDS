import type { Variants } from "framer-motion";

/** True when the user has asked the OS for reduced motion. Deliberately
 * has zero dependencies beyond matchMedia — this used to live in
 * gsapSetup.ts, which pulled the entire GSAP + ScrollTrigger bundle (the
 * bulk of the main chunk) into every page just for this one check. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shared entrance animation: fade-up on scroll reveal, matching
 * innovathon.online's RevealText timing exactly (0.8s, ease [0.16,1,0.3,1]).
 * Respects prefers-reduced-motion via the app-root MotionConfig. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/** Card hover — capped at the 1.015 scale limit set in docs/design-system.md. */
export const cardHover = {
  whileHover: { scale: 1.015 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
};

/** Image hover zoom — capped at 1.04 per docs/design-system.md. */
export const imageZoomHover = {
  whileHover: { scale: 1.04 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};
