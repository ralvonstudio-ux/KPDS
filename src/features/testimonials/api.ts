import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Testimonial = Tables<"testimonials">;

export function useTestimonials() {
  const [data, setData] = useState<Testimonial[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          console.error("[testimonials] Failed to load:", error.message);
          setData([]);
        } else {
          setData(data ?? []);
        }
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}
