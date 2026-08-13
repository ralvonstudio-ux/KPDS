import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils";
import type { Tables } from "@/types/database";

type Customer = Tables<"profiles"> & { bookingCount: number; orderCount: number };

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      const [profilesRes, bookingsRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("role", "customer").order("created_at", { ascending: false }),
        supabase.from("bookings").select("customer_id"),
        supabase.from("orders").select("customer_id"),
      ]);
      if (!isMounted) return;
      if (profilesRes.error) {
        setError(profilesRes.error.message);
        setIsLoading(false);
        return;
      }
      const bookingCounts = new Map<string, number>();
      for (const b of bookingsRes.data ?? []) bookingCounts.set(b.customer_id, (bookingCounts.get(b.customer_id) ?? 0) + 1);
      const orderCounts = new Map<string, number>();
      for (const o of ordersRes.data ?? []) orderCounts.set(o.customer_id, (orderCounts.get(o.customer_id) ?? 0) + 1);

      setCustomers(
        (profilesRes.data ?? []).map((p) => ({
          ...p,
          bookingCount: bookingCounts.get(p.id) ?? 0,
          orderCount: orderCounts.get(p.id) ?? 0,
        })),
      );
      setIsLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <AdminPageHeader eyebrow="Studio" title="Customers" />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} />}
      {!isLoading && !error && customers && customers.length === 0 && (
        <EmptyState title="No customers yet" description="Customer accounts will appear here as people sign up." />
      )}

      {!isLoading && !error && customers && customers.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{c.full_name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted">{c.bookingCount}</td>
                  <td className="px-4 py-3 text-muted">{c.orderCount}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
