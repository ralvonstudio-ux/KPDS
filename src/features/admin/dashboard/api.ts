import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AdminStats {
  totalBookings: number;
  newBookings: number;
  pendingQuotations: number;
  confirmedBookings: number;
  totalOrders: number;
  newOrders: number;
  totalCustomers: number;
  totalRevenuePaise: number;
}

export function useAdminStats() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          totalBookingsRes,
          newBookingsRes,
          confirmedBookingsRes,
          totalOrdersRes,
          newOrdersRes,
          totalCustomersRes,
          draftQuotesRes,
          publishedQuotesRes,
          revenueRes,
        ] = await Promise.all([
          supabase.from("bookings").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
          supabase.from("quotations").select("*", { count: "exact", head: true }).eq("status", "draft"),
          supabase.from("quotations").select("*", { count: "exact", head: true }).eq("status", "published"),
          supabase.from("payments").select("amount_paise").eq("status", "paid"),
        ]);

        for (const res of [
          totalBookingsRes,
          newBookingsRes,
          confirmedBookingsRes,
          totalOrdersRes,
          newOrdersRes,
          totalCustomersRes,
          draftQuotesRes,
          publishedQuotesRes,
          revenueRes,
        ]) {
          if (res.error) throw new Error(res.error.message);
        }

        const totalRevenuePaise = (revenueRes.data ?? []).reduce((sum, p) => sum + p.amount_paise, 0);

        if (!isMounted) return;
        setData({
          totalBookings: totalBookingsRes.count ?? 0,
          newBookings: newBookingsRes.count ?? 0,
          pendingQuotations: (draftQuotesRes.count ?? 0) + (publishedQuotesRes.count ?? 0),
          confirmedBookings: confirmedBookingsRes.count ?? 0,
          totalOrders: totalOrdersRes.count ?? 0,
          newOrders: newOrdersRes.count ?? 0,
          totalCustomers: totalCustomersRes.count ?? 0,
          totalRevenuePaise,
        });
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load dashboard stats.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
