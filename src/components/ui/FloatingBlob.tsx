import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A soft, blurred, drifting color blob — the airy background atmosphere
 * from innovathon.online's `FloatingShape` (same idea, no grid/mesh
 * background pattern, which was deliberately left out). Purely decorative:
 * `-z-10`, `pointer-events-none`, and `mix-blend-multiply` so it reads as
 * a gentle tint against the light page rather than a solid shape. Only
 * shown in light mode — multiply-blending a light pastel color onto a
 * near-black dark-mode page renders as invisible anyway, so it's skipped
 * outright there rather than animated for nothing.
 */
export function FloatingBlob({
  color,
  size,
  top,
  left,
  duration = 15,
  delay = 0,
}: {
  color: string;
  size: string;
  top: string;
  left: string;
  duration?: number;
  delay?: number;
}) {
  const reduced = prefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full opacity-40 blur-3xl mix-blend-multiply dark:hidden ${color} ${size}`}
      style={{ top, left }}
      animate={reduced ? undefined : { y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
      transition={reduced ? undefined : { duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}
