import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "kpds-wishlist";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

interface WishlistContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

/**
 * Device-local wishlist (localStorage, no Supabase table) — a "save for
 * later" nicety for the storefront, not an account feature. If this needs
 * to sync across devices later, it becomes a real `wishlist_items` table
 * keyed to auth.uid() following the same pattern as cart_items.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Privacy mode / storage disabled — wishlist just won't persist.
    }
  }, [ids]);

  const toggle = useCallback((productId: string) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const value = useMemo(() => ({ ids, has, toggle }), [ids, has, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
