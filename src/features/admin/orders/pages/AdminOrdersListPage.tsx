import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminOrders } from "@/features/admin/orders/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Select } from "@/components/ui/Field";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

export default function AdminOrdersListPage() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const { data: orders, isLoading, error, refetch } = useAdminOrders(status);

  return (
    <div>
      <AdminPageHeader eyebrow="Shop" title="Orders" />

      <div className="mb-6">
        <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "all")} className="sm:max-w-xs">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && orders && orders.length === 0 && (
        <EmptyState title="No orders found" description="Try a different filter, or check back once customers start ordering." />
      )}

      {!isLoading && !error && orders && orders.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{o.order_reference}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3 text-muted">{formatINR(o.total_paise)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} kind="order" label={ORDER_STATUS_LABELS[o.status]} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/orders/${o.id}`} className="text-xs font-medium text-ink underline underline-offset-2">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
