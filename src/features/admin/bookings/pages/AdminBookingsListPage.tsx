import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, CalendarDays, MapPin, ChevronRight } from "lucide-react";
import { useAdminBookings } from "@/features/admin/bookings/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input, Select } from "@/components/ui/Field";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { fadeUp, staggerChildren } from "@/lib/motion";
import type { BookingStatus } from "@/types/database";

export default function AdminBookingsListPage() {
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { data: bookings, isLoading, error, refetch } = useAdminBookings({ status, search });

  return (
    <div>
      <div className="mb-8">
        <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">Run the studio</p>
        <h1 className="mt-1 text-display-md text-ink">Bookings</h1>
        <p className="mt-1 text-sm text-muted">Every event request, in one place. Click any card to review and quote it.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search by name, email, or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | "all")} className="sm:max-w-xs">
          <option value="all">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {BOOKING_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && bookings && bookings.length === 0 && (
        <EmptyState title="No bookings found" description="Try a different filter or search term." />
      )}

      {!isLoading && !error && bookings && bookings.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="flex flex-col gap-3">
          {bookings.map((b) => (
            <motion.div key={b.id} variants={fadeUp}>
              <Link
                to={`/admin/bookings/${b.id}`}
                className="group flex flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-clay transition-colors hover:border-gold sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{b.full_name}</p>
                    <span className="shrink-0 text-xs text-muted">{b.booking_reference}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{b.services?.title ?? b.event_type} · {b.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} strokeWidth={1.75} /> {formatDate(b.preferred_event_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} strokeWidth={1.75} /> {b.city}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={b.status} label={BOOKING_STATUS_LABELS[b.status]} />
                  <ChevronRight size={18} strokeWidth={1.75} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
