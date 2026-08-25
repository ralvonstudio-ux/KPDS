import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useServices } from "@/features/services/api";
import { useShopProducts } from "@/features/shop/api";
import { formatINR } from "@/lib/utils";

/**
 * Lightweight client-side search over the two real catalogues (Studio
 * services, Gift Center products) — no separate search backend/route,
 * just an instant filter over data already being fetched elsewhere.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: services } = useServices();
  const { data: products } = useShopProducts();

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const matchedServices = useMemo(
    () => (q.length < 2 ? [] : (services ?? []).filter((s) => s.title.toLowerCase().includes(q)).slice(0, 5)),
    [services, q],
  );
  const matchedProducts = useMemo(
    () => (q.length < 2 ? [] : (products ?? []).filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5)),
    [products, q],
  );
  const hasResults = matchedServices.length > 0 || matchedProducts.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-espresso/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto mt-24 w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-card-lg border border-line bg-surface shadow-clay-lg">
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <SearchIcon />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services and gifts…"
                  className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="rounded-full p-1.5 text-muted hover:bg-black/[0.04] hover:text-ink"
                >
                  <CloseIcon />
                </button>
              </div>

              {q.length >= 2 && (
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {!hasResults && (
                    <p className="px-3 py-6 text-center text-sm text-muted">
                      Nothing matching &ldquo;{query}&rdquo;.
                    </p>
                  )}
                  {matchedServices.length > 0 && (
                    <div className="mb-1">
                      <p className="px-3 py-1.5 text-eyebrow uppercase tracking-[0.12em] text-muted">Studio</p>
                      {matchedServices.map((s) => (
                        <Link
                          key={s.id}
                          to={`/studio/${s.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-black/[0.04]"
                        >
                          <span>{s.title}</span>
                          {s.starting_price_paise && (
                            <span className="text-xs text-muted">From {formatINR(s.starting_price_paise)}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                  {matchedProducts.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-eyebrow uppercase tracking-[0.12em] text-muted">Gift Center</p>
                      {matchedProducts.map((p) => (
                        <Link
                          key={p.id}
                          to={`/gift-center/product/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-black/[0.04]"
                        >
                          <span>{p.name}</span>
                          <span className="text-xs text-muted">{formatINR(p.base_price_paise)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-muted">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
