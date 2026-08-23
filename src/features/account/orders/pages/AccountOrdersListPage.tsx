import { Link } from "react-router-dom";
import { useCustomerOrders } from "@/features/account/orders/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/utils";

export default function AccountOrdersListPage() {
  const { data: orders, isLoading, error, refetch } = useCustomerOrders();

  return (
    <div>
      <PageHeader eyebrow="Your account" title="My Orders" />

      <div className="mt-8">
        {isLoading && <LoadingState />}
        {error && <ErrorState description={error} onRetry={refetch} />}
        {!isLoading && !error && orders && orders.length === 0 && (
          <EmptyState
            title="No orders yet"
            description="Browse the shop to find a gift worth wrapping."
            action={
              <ButtonLink to="/gift-center" variant="outline" className="mt-2">
                Visit the Gift Center
              </ButtonLink>
            }
          />
        )}
        {!isLoading && !error && orders && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/account/orders/${o.id}`}
                className="flex flex-col gap-2 rounded-card border border-line bg-surface p-5 shadow-clay transition-colors hover:border-espresso sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{o.order_reference}</p>
                  <p className="text-xs text-muted">
                    {formatDate(o.created_at)} · {formatINR(o.total_paise)}
                  </p>
                </div>
                <StatusBadge status={o.status} kind="order" label={ORDER_STATUS_LABELS[o.status]} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
