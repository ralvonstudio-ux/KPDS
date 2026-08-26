import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type HeroImage = Tables<"hero_images">;

/** Published hero carousel images, admin-managed from /admin/hero. Returns
 * `undefined` while loading (vs. `[]` once loaded with nothing published) so
 * Hero.tsx can tell "still fetching" apart from "table is genuinely empty,
 * use the fallback". */
export function useHeroImages(): HeroImage[] | undefined {
  const [data, setData] = useState<HeroImage[] | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (!isMounted) return;
      if (error) {
        console.error("[home] Failed to load hero images:", error.message);
        setData([]);
        return;
      }
      setData(data ?? []);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}
