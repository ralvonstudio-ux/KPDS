import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CustomisationField, Tables } from "@/types/database";

export type Product = Tables<"products">;
export type ProductImage = Tables<"product_images">;
export type ProductVariant = Tables<"product_variants">;

export interface ProductDraft {
  category_id: string | null;
  slug: string;
  name: string;
  description: string;
  base_price_paise: number;
  is_customisable: boolean;
  customisation_fields: CustomisationField[];
  stock_tracked: boolean;
  stock_quantity: number;
  is_published: boolean;
  is_archived: boolean;
  sort_order: number;
}

export function useAdminProducts() {
  const [data, setData] = useState<(Product & { categories: { name: string } | null })[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useAdminProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const [productRes, imagesRes, variantsRes] = await Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("product_images").select("*").eq("product_id", id).order("sort_order", { ascending: true }),
      supabase.from("product_variants").select("*").eq("product_id", id).order("created_at", { ascending: true }),
    ]);
    if (productRes.error) setError(productRes.error.message);
    else setProduct(productRes.data);
    setImages(imagesRes.data ?? []);
    setVariants(variantsRes.data ?? []);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { product, images, variants, isLoading, error, refetch };
}

export async function createProduct(draft: ProductDraft): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(draft).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, draft: Partial<ProductDraft>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(draft).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addProductImage(productId: string, imageUrl: string, sortOrder: number) {
  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, image_url: imageUrl, sort_order: sortOrder })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeProductImage(imageId: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
}

export async function createProductVariant(
  productId: string,
  input: { name: string; sku: string | null; price_paise: number | null; stock_quantity: number; is_default: boolean },
) {
  const { data, error } = await supabase
    .from("product_variants")
    .insert({ product_id: productId, ...input })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProductVariant(id: string, input: Partial<ProductVariant>) {
  const { data, error } = await supabase.from("product_variants").update(input).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProductVariant(id: string) {
  const { error } = await supabase.from("product_variants").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
