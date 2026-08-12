import { Link } from "react-router-dom";
import { useAdminStats } from "@/features/admin/dashboard/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ErrorState } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { data: stats, isLoading, error } = useAdminStats();

  return (
    <div>
      <AdminPageHeader eyebrow="Studio operations" title="Overview" />

      {error && <ErrorState description={error} />}

      {!error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile label="New bookings" value={stats?.newBookings} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile label="Pending quotations" value={stats?.pendingQuotations} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile label="Confirmed bookings" value={stats?.confirmedBookings} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile label="Total bookings" value={stats?.totalBookings} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile label="New orders" value={stats?.newOrders} isLoading={isLoading} to="/admin/orders" />
          <KpiTile label="Total orders" value={stats?.totalOrders} isLoading={isLoading} to="/admin/orders" />
          <KpiTile label="Customers" value={stats?.totalCustomers} isLoading={isLoading} to="/admin/customers" />
          <KpiTile
            label="Revenue collected"
            value={stats ? formatINR(stats.totalRevenuePaise) : undefined}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

function KpiTile({
  label,
  value,
  isLoading,
  to,
}: {
  label: string;
  value: number | string | undefined;
  isLoading: boolean;
  to?: string;
}) {
  const content = (
    <div className="rounded-card border border-line bg-surface p-5 shadow-clay transition-colors hover:border-espresso">
      <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-display-sm text-ink">
        {isLoading ? <span className="inline-block h-8 w-16 animate-pulse rounded bg-black/10" /> : value}
      </p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}
