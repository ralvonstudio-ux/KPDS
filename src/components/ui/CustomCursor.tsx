import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Subtle custom cursor — desktop (fine pointer, non-touch) only. Any
 * element can opt in with `data-cursor="View"` / `"Open"` / `"Arrow"` and
 * the label swaps on hover via event delegation, so nothing needs to wire
 * through context or props to use it.
 *
 * Deliberately defensive: only toggles `cursor: none` on <html> from
 * inside this component's own effect, so if it fails to mount for any
 * reason the OS cursor is simply never hidden — there is no static CSS
 * rule that could strand a user with no visible pointer at all.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isDown, setIsDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;
    setEnabled(true);
    document.documentElement.classList.add("kpds-cursor-none");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("kpds-cursor-none");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] flex items-center justify-center rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 64 : isDown ? 10 : 14,
        height: label ? 64 : isDown ? 10 : 14,
        backgroundColor: "#FAF9F6",
      }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {label && <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-espresso">{label}</span>}
    </motion.div>
  );
}
