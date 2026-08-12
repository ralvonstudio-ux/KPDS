import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminBookings } from "@/features/admin/bookings/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input, Select } from "@/components/ui/Field";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { BookingStatus } from "@/types/database";

export default function AdminBookingsListPage() {
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { data: bookings, isLoading, error, refetch } = useAdminBookings({ status, search });

  return (
    <div>
      <AdminPageHeader eyebrow="Studio" title="Bookings" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by name, email, or reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
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
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Event date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{b.booking_reference}</td>
                  <td className="px-4 py-3 text-muted">
                    {b.full_name}
                    <div className="text-xs">{b.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{b.services?.title ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(b.preferred_event_date)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} label={BOOKING_STATUS_LABELS[b.status]} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/bookings/${b.id}`} className="text-xs font-medium text-ink underline underline-offset-2">
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
