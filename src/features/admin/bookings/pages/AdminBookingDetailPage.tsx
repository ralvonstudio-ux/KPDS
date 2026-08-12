import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAdminBookingDetail, updateBookingStatus } from "@/features/admin/bookings/api";
import { QuotationBuilder } from "@/features/admin/bookings/components/QuotationBuilder";
import { TeamAssignmentPanel } from "@/features/admin/bookings/components/TeamAssignmentPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Select } from "@/components/ui/Field";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/utils";
import type { BookingStatus } from "@/types/database";

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { booking, quotation, items, history, assignments, payments, isLoading, error, refetch } = useAdminBookingDetail(id);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (isLoading) return <LoadingState />;
  if (error || !booking) return <ErrorState description={error ?? "Booking not found."} onRetry={refetch} />;

  const handleStatusChange = async (status: BookingStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateBookingStatus(booking.id, status);
      refetch();
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/bookings" className="text-sm text-muted underline underline-offset-2 hover:text-ink">
        ← All bookings
      </Link>

      <AdminPageHeader
        eyebrow={booking.booking_reference}
        title={booking.full_name}
        action={<StatusBadge status={booking.status} label={BOOKING_STATUS_LABELS[booking.status]} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Event details</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Service</dt>
              <dd className="text-ink">{booking.services?.title ?? "Not specified"}</dd>
              <dt className="text-muted">Event type</dt>
              <dd className="text-ink">{booking.event_type}</dd>
              <dt className="text-muted">Preferred date</dt>
              <dd className="text-ink">{formatDate(booking.preferred_event_date)}</dd>
              <dt className="text-muted">Location</dt>
              <dd className="text-ink">{booking.event_location}, {booking.city}</dd>
              <dt className="text-muted">Contact</dt>
              <dd className="text-ink">{booking.mobile} · {booking.email}</dd>
              {booking.notes && (
                <>
                  <dt className="text-muted">Notes</dt>
                  <dd className="text-ink">{booking.notes}</dd>
                </>
              )}
            </dl>
          </section>

          <section>
            <p className="mb-3 text-sm font-medium text-ink">Quotation</p>
            <QuotationBuilder bookingId={booking.id} quotation={quotation} items={items} onChange={refetch} />
          </section>

          <section>
            <p className="mb-3 text-sm font-medium text-ink">Assigned team</p>
            <TeamAssignmentPanel bookingId={booking.id} assignments={assignments} onChange={refetch} />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Status</p>
            <Select
              value={booking.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
            >
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {BOOKING_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </section>

          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Payments</p>
            {payments.length === 0 ? (
              <p className="text-sm text-muted">No payments yet.</p>
            ) : (
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Advance required</span>
                  <span>{formatINR(booking.advance_amount_paise)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Total paid</span>
                  <span className="text-ink">{formatINR(booking.advance_paid_paise)}</span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5 border-t border-line pt-2">
                  {payments.map((p) => (
                    <div key={p.id} className="flex justify-between text-xs">
                      <span className="capitalize text-muted">{p.purpose.replace("_", " ")}</span>
                      <span className={p.status === "paid" ? "text-emerald-700" : p.status === "failed" ? "text-red-700" : "text-muted"}>
                        {formatINR(p.amount_paise)} · {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Timeline</p>
            <ol className="flex flex-col gap-3 text-sm">
              {history.map((h) => (
                <li key={h.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <div>
                    <p className="text-ink">{BOOKING_STATUS_LABELS[h.status]}</p>
                    <p className="text-xs text-muted">{formatDate(h.created_at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
