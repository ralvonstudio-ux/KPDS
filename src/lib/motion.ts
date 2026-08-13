import type { Variants } from "framer-motion";

/** Shared entrance animation: gentle fade-up, 300–600ms, editorial ease. Respects prefers-reduced-motion via framer-motion's automatic OS-level handling. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
