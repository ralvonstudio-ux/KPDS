import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type HeroImage = Tables<"hero_images">;
export interface HeroImageDraft {
  image_url: string;
  alt_text: string | null;
  is_published: boolean;
  sort_order: number;
}

export function useAdminHeroImages() {
  const [data, setData] = useState<HeroImage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("hero_images").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export async function createHeroImage(draft: Partial<HeroImageDraft> & { image_url: string }) {
  const { data, error } = await supabase.from("hero_images").insert(draft).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateHeroImage(id: string, draft: Partial<HeroImageDraft>) {
  const { error } = await supabase.from("hero_images").update(draft).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteHeroImage(id: string) {
  const { error } = await supabase.from("hero_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
