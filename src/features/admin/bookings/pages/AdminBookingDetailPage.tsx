import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Receipt,
  Users,
  Wallet,
  History,
  MapPin,
  Phone,
  Mail,
  StickyNote,
  ArrowRight,
  XCircle,
  Check,
} from "lucide-react";
import { useAdminBookingDetail, updateBookingStatus } from "@/features/admin/bookings/api";
import { QuotationBuilder } from "@/features/admin/bookings/components/QuotationBuilder";
import { TeamAssignmentPanel } from "@/features/admin/bookings/components/TeamAssignmentPanel";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Select } from "@/components/ui/Field";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatINR, cn } from "@/lib/utils";
import { fadeUp, staggerChildren } from "@/lib/motion";
import type { BookingStatus } from "@/types/database";

// The studio's normal, linear day-to-day flow. "Rejected" is a separate
// exceptional exit, handled by its own button rather than living in this
// sequence — a non-technical admin should never see it as "step 6 of 10".
const FLOW: BookingStatus[] = [
  "new",
  "advance_paid",
  "under_review",
  "contacted",
  "quoted",
  "confirmed",
  "shoot_completed",
  "delivered",
  "closed",
];

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { booking, quotation, items, history, assignments, payments, isLoading, error, refetch } = useAdminBookingDetail(id);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showManualStatus, setShowManualStatus] = useState(false);

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

  const flowIndex = FLOW.indexOf(booking.status);
  const isRejected = booking.status === "rejected";
  const nextStatus = flowIndex >= 0 && flowIndex < FLOW.length - 1 ? FLOW[flowIndex + 1] : null;
  const advancePct = booking.advance_amount_paise > 0 ? Math.min(100, Math.round((booking.advance_paid_paise / booking.advance_amount_paise) * 100)) : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} strokeWidth={1.75} /> All bookings
      </Link>

      <div className="mb-8 mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">{booking.booking_reference}</p>
          <h1 className="mt-1 text-display-md text-ink">{booking.full_name}</h1>
        </div>
        <StatusBadge status={booking.status} label={BOOKING_STATUS_LABELS[booking.status]} />
      </div>

      {/* Progress stepper — the main "how do I move this along" UI. */}
      {!isRejected && (
        <div className="mb-8 rounded-card-lg border border-line bg-surface p-5 shadow-clay">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {FLOW.map((status, i) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    i < flowIndex ? "bg-gold text-white" : i === flowIndex ? "bg-espresso text-white" : "bg-black/[0.06] text-muted",
                  )}
                  title={BOOKING_STATUS_LABELS[status]}
                >
                  {i < flowIndex ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                </div>
                {i < FLOW.length - 1 && <div className={cn("h-0.5 w-4 shrink-0 sm:w-8", i < flowIndex ? "bg-gold" : "bg-black/[0.08]")} />}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {nextStatus ? (
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleStatusChange(nextStatus)}
                className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white shadow-clay transition-transform active:translate-y-px hover:bg-gold-deep disabled:opacity-50"
              >
                Mark as {BOOKING_STATUS_LABELS[nextStatus]} <ArrowRight size={16} strokeWidth={2} />
              </button>
            ) : (
              <p className="text-sm text-muted">This booking has reached the end of the workflow.</p>
            )}
            <button
              type="button"
              onClick={() => setShowManualStatus((v) => !v)}
              className="text-xs font-medium text-muted underline underline-offset-2 hover:text-ink"
            >
              Set a different status
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("rejected")}
              className="ml-auto flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-800"
            >
              <XCircle size={14} strokeWidth={1.75} /> Reject booking
            </button>
          </div>

          {showManualStatus && (
            <div className="mt-3 max-w-xs">
              <Select value={booking.status} disabled={isUpdatingStatus} onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}>
                {BOOKING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {BOOKING_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}

      {isRejected && (
        <div className="mb-8 flex items-center justify-between rounded-card-lg border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-800">This booking was rejected.</p>
          <button
            type="button"
            onClick={() => handleStatusChange("new")}
            className="text-xs font-medium text-red-800 underline underline-offset-2"
          >
            Reopen as New
          </button>
        </div>
      )}

      <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <motion.section variants={fadeUp} className="rounded-card border border-line bg-surface p-5">
            <SectionTitle icon={CalendarDays} label="Event details" />
            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
              <Field label="Service" value={booking.services?.title ?? "Not specified"} />
              <Field label="Event type" value={booking.event_type} />
              <Field label="Preferred date" value={formatDate(booking.preferred_event_date)} />
              <Field icon={MapPin} label="Location" value={`${booking.event_location}, ${booking.city}`} />
              <Field icon={Phone} label="Phone" value={booking.mobile} />
              <Field icon={Mail} label="Email" value={booking.email} />
            </dl>
            {booking.notes && (
              <div className="mt-3 flex gap-2 rounded-xl bg-black/[0.03] p-3 text-sm text-ink/80">
                <StickyNote size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted" />
                {booking.notes}
              </div>
            )}
          </motion.section>

          <motion.section variants={fadeUp}>
            <SectionTitle icon={Receipt} label="Quotation" />
            <QuotationBuilder bookingId={booking.id} quotation={quotation} items={items} onChange={refetch} />
          </motion.section>

          <motion.section variants={fadeUp}>
            <SectionTitle icon={Users} label="Assigned team" />
            <TeamAssignmentPanel bookingId={booking.id} assignments={assignments} onChange={refetch} />
          </motion.section>
        </div>

        <div className="flex flex-col gap-6">
          <motion.section variants={fadeUp} className="rounded-card border border-line bg-surface p-5">
            <SectionTitle icon={Wallet} label="Payments" />
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{formatINR(booking.advance_paid_paise)} collected</span>
                <span>{formatINR(booking.advance_amount_paise)} advance</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${advancePct}%` }} />
              </div>
            </div>
            {payments.length === 0 ? (
              <p className="text-sm text-muted">No payments yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5 border-t border-line pt-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between text-xs">
                    <span className="capitalize text-muted">{p.purpose.replace("_", " ")}</span>
                    <span className={p.status === "paid" ? "text-emerald-700" : p.status === "failed" ? "text-red-700" : "text-muted"}>
                      {formatINR(p.amount_paise)} · {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section variants={fadeUp} className="rounded-card border border-line bg-surface p-5">
            <SectionTitle icon={History} label="Timeline" />
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
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: typeof CalendarDays; label: string }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
      <Icon size={16} strokeWidth={1.75} className="text-gold" />
      {label}
    </p>
  );
}

function Field({ icon: Icon, label, value }: { icon?: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        {Icon && <Icon size={12} strokeWidth={1.75} />}
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
