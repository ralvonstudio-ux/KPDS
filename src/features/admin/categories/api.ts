import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;
export type CategoryInput = Omit<Category, "id" | "created_at" | "updated_at">;

export function useAdminCategories() {
  const [data, setData] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export async function createCategory(input: Partial<CategoryInput>) {
  const { data, error } = await supabase.from("categories").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const { data, error } = await supabase.from("categories").update(input).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
