import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type PortfolioItem = Tables<"portfolio_items">;
export interface PortfolioDraft {
  title: string | null;
  category: string;
  description: string | null;
  cover_image_url: string;
  gallery: string[];
  is_published: boolean;
  sort_order: number;
}

export function useAdminPortfolio() {
  const [data, setData] = useState<PortfolioItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("portfolio_items").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useAdminPortfolioItem(id: string | undefined) {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("portfolio_items").select("*").eq("id", id).single();
    if (error) setError(error.message);
    else setItem(data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { item, isLoading, error, refetch };
}

export async function createPortfolioItem(draft: PortfolioDraft) {
  const { data, error } = await supabase.from("portfolio_items").insert(draft).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePortfolioItem(id: string, draft: Partial<PortfolioDraft>) {
  const { data, error } = await supabase.from("portfolio_items").update(draft).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePortfolioItem(id: string) {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
