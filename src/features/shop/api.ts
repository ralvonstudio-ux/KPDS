import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type ProductImage = Tables<"product_images">;
export type ProductVariant = Tables<"product_variants">;
export type ProductWithImages = Product & { product_images: ProductImage[] };
export type ProductWithDetail = Product & {
  product_images: ProductImage[];
  product_variants: ProductVariant[];
  categories: { name: string; slug: string } | null;
};

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useShopCategories() {
  const [state, setState] = useState<AsyncState<Category[]>>({ data: null, isLoading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    supabase
      .from("categories")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;
        setState(error ? { data: null, isLoading: false, error: error.message } : { data: data ?? [], isLoading: false, error: null });
      });
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  return { ...state, refetch: () => setReloadKey((k) => k + 1) };
}

export function useShopProducts(categorySlug?: string) {
  const [state, setState] = useState<AsyncState<ProductWithImages[]>>({ data: null, isLoading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    async function run() {
      let categoryId: string | undefined;
      if (categorySlug) {
        const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
        if (!category) {
          if (isMounted) setState({ data: [], isLoading: false, error: null });
          return;
        }
        categoryId = category.id;
      }

      let query = supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("is_published", true)
        .eq("is_archived", false)
        .order("sort_order", { ascending: true });
      if (categoryId) query = query.eq("category_id", categoryId);

      const { data, error } = await query;
      if (!isMounted) return;
      setState(error ? { data: null, isLoading: false, error: error.message } : { data: (data as ProductWithImages[]) ?? [], isLoading: false, error: null });
    }
    run();

    return () => {
      isMounted = false;
    };
  }, [categorySlug, reloadKey]);

  return { ...state, refetch: () => setReloadKey((k) => k + 1) };
}

export function useShopProduct(slug: string | undefined) {
  const [state, setState] = useState<AsyncState<ProductWithDetail>>({ data: null, isLoading: true, error: null });

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setState({ data: null, isLoading: true, error: null });

    supabase
      .from("products")
      .select("*, product_images(*), product_variants(*), categories(name, slug)")
      .eq("slug", slug)
      .eq("is_published", true)
      .eq("is_archived", false)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted) return;
        setState(
          error
            ? { data: null, isLoading: false, error: error.message }
            : { data: data as ProductWithDetail | null, isLoading: false, error: null },
        );
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return state;
}
