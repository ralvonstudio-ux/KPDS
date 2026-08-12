import { useParams, Link } from "react-router-dom";
import { useCustomerOrderDetail } from "@/features/account/orders/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/utils";

export default function AccountOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { order, items, history, isLoading, error, refetch } = useCustomerOrderDetail(id);

  if (isLoading) return <LoadingState />;
  if (error || !order) return <ErrorState description={error ?? "Order not found."} onRetry={refetch} />;

  const address = order.shipping_address as { full_name: string; phone: string; line1: string; line2: string | null; city: string; state: string; pincode: string };

  return (
    <div>
      <Link to="/account/orders" className="text-sm text-muted underline underline-offset-2 hover:text-ink">
        ← My Orders
      </Link>

      <PageHeader eyebrow={order.order_reference} title={`Order — ${formatDate(order.created_at)}`} />
      <div className="mt-2 flex justify-center">
        <StatusBadge status={order.status} kind="order" label={ORDER_STATUS_LABELS[order.status]} />
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Items</p>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 text-sm last:border-0 last:pb-0">
                  <p className="text-ink">
                    {item.product_name} {item.variant_name && <span className="text-muted">({item.variant_name})</span>} × {item.quantity}
                  </p>
                  <span className="shrink-0 text-ink">{formatINR(item.amount_paise)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-3 text-base font-medium text-ink">
              <span>Total</span>
              <span>{formatINR(order.total_paise)}</span>
            </div>
          </section>

          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Shipping address</p>
            <p className="text-sm text-ink/90">
              {address.full_name}
              <br />
              {address.line1}
              {address.line2 && <>, {address.line2}</>}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.phone}
            </p>
          </section>
        </div>

        <section className="rounded-card border border-line bg-surface p-5">
          <p className="mb-3 text-sm font-medium text-ink">Timeline</p>
          <ol className="flex flex-col gap-3 text-sm">
            {history.map((h) => (
              <li key={h.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <div>
                  <p className="text-ink">{ORDER_STATUS_LABELS[h.status]}</p>
                  <p className="text-xs text-muted">{formatDate(h.created_at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
