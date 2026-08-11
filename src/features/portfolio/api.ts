import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type PortfolioItem = Tables<"portfolio_items">;

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function usePortfolioItems() {
  const [state, setState] = useState<AsyncState<PortfolioItem[]>>({ data: null, isLoading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    supabase
      .from("portfolio_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setState({ data: null, isLoading: false, error: error.message });
          return;
        }
        setState({ data: data ?? [], isLoading: false, error: null });
      });

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  return { ...state, refetch: () => setReloadKey((k) => k + 1) };
}
