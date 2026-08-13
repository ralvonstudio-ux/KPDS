import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A pointer-tracked 3D tilt, the same interaction language as the homepage
 * hero's Three.js scene but built entirely on CSS transforms via Framer
 * Motion — no WebGL, no extra bundle weight, safe to use on every card in
 * the product (portfolio tiles, service/product cards, bento tiles).
 * No-ops on touch devices (tilt-on-hover has no touch equivalent) and
 * under prefers-reduced-motion.
 */
export function TiltCard({ children, className, maxTilt = 8 }: { children: ReactNode; className?: string; maxTilt?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 300, damping: 30, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn("motion-reduce:!transform-none", className)}
    >
      {children}
    </motion.div>
  );
}
