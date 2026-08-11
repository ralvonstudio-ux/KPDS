import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Minimal overview for Day 2–3 (proves the admin-only shell + route guard
 * work end to end). Real KPI tiles (bookings, pending quotations, orders,
 * revenue) land in the admin-hardening phase — see docs/build-plan.md.
 */
export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader eyebrow="Studio operations" title="Overview" />
      <div className="mt-10 rounded-card border border-dashed border-line-strong bg-surface/60 p-8 text-center text-sm text-muted">
        KPI tiles, booking queue, and pending quotations will appear here once the admin
        operations build lands.
      </div>
    </div>
  );
}
