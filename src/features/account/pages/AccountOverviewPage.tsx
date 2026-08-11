import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Minimal overview for Day 2–3 (proves the authenticated shell + route
 * guards work end to end). Bento layout with real booking/order/quotation
 * data lands in the customer-dashboard phase — see docs/build-plan.md.
 */
export default function AccountOverviewPage() {
  const { profile } = useAuth();

  return (
    <div>
      <PageHeader
        eyebrow="Your account"
        title={profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome back"}
      />
      <div className="mt-10 rounded-card border border-dashed border-line-strong bg-surface/60 p-8 text-center text-sm text-muted">
        Your bookings, quotations, and orders will appear here once the dashboard build lands.
      </div>
    </div>
  );
}
