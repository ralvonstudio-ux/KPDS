import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCustomerBookingDetail, acceptQuotation } from "@/features/account/bookings/api";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/features/payments/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/utils";

export default function AccountBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { booking, quotation, items, history, payments, assignments, isLoading, error, refetch } = useCustomerBookingDetail(id);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;
  if (error || !booking) return <ErrorState description={error ?? "Booking not found."} onRetry={refetch} />;

  const handleAccept = async () => {
    if (!quotation) return;
    setIsAccepting(true);
    setActionError(null);
    try {
      await acceptQuotation(quotation.id);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not accept the quotation.");
    } finally {
      setIsAccepting(false);
    }
  };

  const balanceDue = quotation && quotation.status === "accepted" ? quotation.total_paise - booking.advance_paid_paise : 0;

  const handlePayBalance = async () => {
    setIsPaying(true);
    setActionError(null);
    try {
      const order = await createRazorpayOrder({ purpose: "booking_balance", bookingId: booking.id });
      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Khatu Pixel Digital Studio",
        description: `Balance payment — ${booking.booking_reference}`,
        prefill: { name: booking.full_name, email: booking.email, contact: booking.mobile },
        theme: { color: "#C59D5F" },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(response);
            refetch();
          } catch (err) {
            setActionError(err instanceof Error ? err.message : "Payment could not be verified.");
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not start the payment.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div>
      <Link to="/account/bookings" className="text-sm text-muted underline underline-offset-2 hover:text-ink">
        ← My Bookings
      </Link>

      <PageHeader eyebrow={booking.booking_reference} title={booking.services?.title ?? booking.event_type} />

      <div className="mt-2 flex justify-center">
        <StatusBadge status={booking.status} label={BOOKING_STATUS_LABELS[booking.status]} />
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Event details</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Event type</dt>
              <dd className="text-ink">{booking.event_type}</dd>
              <dt className="text-muted">Date</dt>
              <dd className="text-ink">{formatDate(booking.preferred_event_date)}</dd>
              <dt className="text-muted">Location</dt>
              <dd className="text-ink">{booking.event_location}, {booking.city}</dd>
            </dl>
          </section>

          {quotation && (
            <section className="rounded-card border border-line bg-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Quotation</p>
                <span className="rounded-full bg-black/[0.06] px-2.5 py-1 text-xs font-medium capitalize text-ink">{quotation.status}</span>
              </div>

              {items.length > 0 && (
                <div className="mb-4 flex flex-col gap-1.5 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted">
                      <span>{item.label} × {item.quantity}</span>
                      <span>{formatINR(item.amount_paise)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1 border-t border-line pt-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatINR(quotation.subtotal_paise)}</span>
                </div>
                {quotation.discount_paise > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Discount</span>
                    <span>−{formatINR(quotation.discount_paise)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>GST ({quotation.gst_percent}%)</span>
                  <span>{formatINR(quotation.gst_paise)}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-ink">
                  <span>Total</span>
                  <span>{formatINR(quotation.total_paise)}</span>
                </div>
              </div>

              {quotation.status === "published" && (
                <Button variant="gold" className="mt-4 w-full" disabled={isAccepting} onClick={handleAccept}>
                  {isAccepting ? "Accepting…" : "Accept Quotation"}
                </Button>
              )}

              {quotation.status === "accepted" && balanceDue > 0 && (
                <Button variant="gold" className="mt-4 w-full" disabled={isPaying} onClick={handlePayBalance}>
                  {isPaying ? "Opening secure payment…" : `Pay Balance — ${formatINR(balanceDue)}`}
                </Button>
              )}

              {quotation.status === "accepted" && balanceDue <= 0 && (
                <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800">
                  Fully paid — thank you!
                </p>
              )}

              {actionError && <p className="mt-2 text-xs text-red-700">{actionError}</p>}
            </section>
          )}

          {assignments.length > 0 && (
            <section className="rounded-card border border-line bg-surface p-5">
              <p className="mb-3 text-sm font-medium text-ink">Your team</p>
              <div className="flex flex-col gap-1.5 text-sm">
                {assignments.map((a) => (
                  <p key={a.id} className="text-ink/90">
                    {a.team_members?.full_name} <span className="text-muted">— {a.assigned_role || a.team_members?.role}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-card border border-line bg-surface p-5">
            <p className="mb-3 text-sm font-medium text-ink">Payments</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Advance required</span>
                <span>{formatINR(booking.advance_amount_paise)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Total paid</span>
                <span className="text-ink">{formatINR(booking.advance_paid_paise)}</span>
              </div>
            </div>
            {payments.length > 0 && (
              <div className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-xs text-muted">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between">
                    <span className="capitalize">{p.purpose.replace("_", " ")}</span>
                    <span>{formatINR(p.amount_paise)} · {p.status}</span>
                  </div>
                ))}
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
