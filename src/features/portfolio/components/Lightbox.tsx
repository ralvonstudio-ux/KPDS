import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PortfolioItem } from "@/features/portfolio/api";

export function Lightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: {
  items: PortfolioItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const item = activeIndex !== null ? items[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && activeIndex < items.length - 1) onNavigate(activeIndex + 1);
      if (e.key === "ArrowLeft" && activeIndex > 0) onNavigate(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {item && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? "Portfolio image"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/95 p-4 md:p-10"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {activeIndex > 0 && (
            <NavButton side="left" onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }} />
          )}
          {activeIndex < items.length - 1 && (
            <NavButton side="right" onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }} />
          )}

          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex max-h-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.cover_image_url}
              alt={item.title ?? ""}
              className="max-h-[75vh] w-auto rounded-lg object-contain shadow-clay-lg"
            />
            {(item.title || item.category) && (
              <div className="mt-4 text-center text-white">
                {item.title && <p className="text-lg font-medium">{item.title}</p>}
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/60">{item.category}</p>
                {item.description && <p className="mx-auto mt-2 max-w-md text-sm text-white/80">{item.description}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 ${side === "left" ? "left-3 md:left-8" : "right-3 md:right-8"}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        {side === "left" ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
