import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Homepage-only loading screen — deliberately not mounted at the App root,
 * so the rest of the site (login, checkout, admin) never pays for it.
 * Tied to the actual hero image finishing (or a 2.2s safety cap, whichever
 * comes first) rather than an arbitrary timer, per the "do not
 * intentionally create a long loading screen" rule.
 */
export function LoadingScreen({ imageSrc, onDone }: { imageSrc: string; onDone: () => void }) {
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    // Eases toward 92% over ~1.1s so it never looks "stuck" waiting on the
    // network — the real image load (or the safety cap) takes it the rest
    // of the way to 100.
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - t, 3);
      if (!doneRef.current) setPercent(Math.min(92, Math.round(eased * 92)));
      if (t < 1 && !doneRef.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPercent(100);
      setTimeout(() => setIsDone(true), 320);
    };

    const img = new Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = imageSrc;

    const safetyCap = setTimeout(finish, 2200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safetyCap);
    };
  }, [imageSrc]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-espresso"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white">KPDS</p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/50">
            {String(percent).padStart(2, "0")} — 100%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
