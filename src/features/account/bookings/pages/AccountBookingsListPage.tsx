import { Link } from "react-router-dom";
import { useCustomerBookings } from "@/features/account/bookings/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function AccountBookingsListPage() {
  const { data: bookings, isLoading, error, refetch } = useCustomerBookings();

  return (
    <div>
      <PageHeader eyebrow="Your account" title="My Bookings" />

      <div className="mt-8">
        {isLoading && <LoadingState />}
        {error && <ErrorState description={error} onRetry={refetch} />}
        {!isLoading && !error && bookings && bookings.length === 0 && (
          <EmptyState
            title="No bookings yet"
            description="Ready to reserve your date?"
            action={
              <ButtonLink to="/book-your-event" variant="gold" className="mt-2">
                Book Your Event
              </ButtonLink>
            }
          />
        )}
        {!isLoading && !error && bookings && bookings.length > 0 && (
          <div className="flex flex-col gap-3">
            {bookings.map((b) => (
              <Link
                key={b.id}
                to={`/account/bookings/${b.id}`}
                className="flex flex-col gap-2 rounded-card border border-line bg-surface p-5 shadow-clay transition-colors hover:border-espresso sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{b.services?.title ?? b.event_type}</p>
                  <p className="text-xs text-muted">
                    {b.booking_reference} · {formatDate(b.preferred_event_date)}
                  </p>
                </div>
                <StatusBadge status={b.status} label={BOOKING_STATUS_LABELS[b.status]} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
