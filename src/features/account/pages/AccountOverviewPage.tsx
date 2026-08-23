import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCustomerBookings } from "@/features/account/bookings/api";
import { useCustomerOrders } from "@/features/account/orders/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/States";
import { BOOKING_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/utils";

export default function AccountOverviewPage() {
  const { profile } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useCustomerBookings();
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders();

  const latestBooking = bookings?.[0];
  const latestOrder = orders?.[0];

  return (
    <div>
      <PageHeader
        eyebrow="Your account"
        title={profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome back"}
      />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-card-lg border border-line bg-surface p-6 shadow-clay">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Latest booking</p>
          {bookingsLoading ? (
            <div className="mt-4"><Spinner /></div>
          ) : latestBooking ? (
            <div className="mt-3">
              <p className="text-lg font-medium text-ink">{latestBooking.services?.title ?? latestBooking.event_type}</p>
              <p className="text-sm text-muted">{formatDate(latestBooking.preferred_event_date)}</p>
              <div className="mt-3">
                <StatusBadge status={latestBooking.status} label={BOOKING_STATUS_LABELS[latestBooking.status]} />
              </div>
              <Link to={`/account/bookings/${latestBooking.id}`} className="mt-4 inline-block text-sm font-medium text-ink underline underline-offset-2">
                View details
              </Link>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-muted">No bookings yet.</p>
              <ButtonLink to="/book-your-event" variant="gold" size="sm" className="mt-3">
                Book Your Event
              </ButtonLink>
            </div>
          )}
        </div>

        <div className="rounded-card-lg border border-line bg-surface p-6 shadow-clay">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Latest order</p>
          {ordersLoading ? (
            <div className="mt-4"><Spinner /></div>
          ) : latestOrder ? (
            <div className="mt-3">
              <p className="text-lg font-medium text-ink">{latestOrder.order_reference}</p>
              <p className="text-sm text-muted">{formatINR(latestOrder.total_paise)}</p>
              <div className="mt-3">
                <StatusBadge status={latestOrder.status} kind="order" label={ORDER_STATUS_LABELS[latestOrder.status]} />
              </div>
              <Link to={`/account/orders/${latestOrder.id}`} className="mt-4 inline-block text-sm font-medium text-ink underline underline-offset-2">
                View details
              </Link>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-muted">No orders yet.</p>
              <ButtonLink to="/gift-center" variant="outline" size="sm" className="mt-3">
                Visit the Gift Center
              </ButtonLink>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <QuickLink to="/account/bookings" label="All Bookings" />
        <QuickLink to="/account/orders" label="All Orders" />
        <QuickLink to="/account/profile" label="Profile Settings" />
      </div>
    </div>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-card border border-line bg-surface p-5 text-sm font-medium text-ink transition-colors hover:border-espresso"
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}
