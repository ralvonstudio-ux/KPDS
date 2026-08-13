import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Service = Tables<"services">;
export type ServiceGalleryImage = Tables<"service_gallery">;
export type ServiceWithGallery = Service & { service_gallery: ServiceGalleryImage[] };

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useServices(limit?: number) {
  const [state, setState] = useState<AsyncState<Service[]>>({ data: null, isLoading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    let query = supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (limit) query = query.limit(limit);

    query.then(({ data, error }) => {
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
  }, [reloadKey, limit]);

  return { ...state, refetch: () => setReloadKey((k) => k + 1) };
}

export function useService(slug: string | undefined) {
  const [state, setState] = useState<AsyncState<ServiceWithGallery>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setState({ data: null, isLoading: true, error: null });

    supabase
      .from("services")
      .select("*, service_gallery(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .order("sort_order", { referencedTable: "service_gallery", ascending: true })
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setState({ data: null, isLoading: false, error: error.message });
          return;
        }
        setState({ data: data as ServiceWithGallery | null, isLoading: false, error: null });
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return state;
}
