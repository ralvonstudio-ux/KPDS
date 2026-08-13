import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  FileClock,
  BadgeCheck,
  CalendarRange,
  ShoppingBag,
  PackageCheck,
  Users,
  Wallet,
  PlusCircle,
  Gift,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminStats } from "@/features/admin/dashboard/api";
import { ErrorState } from "@/components/ui/States";
import { formatINR, cn } from "@/lib/utils";
import { fadeUp, staggerChildren } from "@/lib/motion";

export default function AdminOverviewPage() {
  const { profile } = useAuth();
  const { data: stats, isLoading, error } = useAdminStats();
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div>
      <div className="mb-8">
        <p className="text-eyebrow uppercase tracking-[0.1em] text-gold">Studio operations</p>
        <h1 className="mt-1 text-display-md text-ink">{firstName ? `Welcome back, ${firstName}` : "Overview"}</h1>
        <p className="mt-1 text-sm text-muted">Here's what's happening with your studio today.</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <QuickAction to="/admin/bookings" icon={CalendarCheck} label="Handle a booking" tone="gold" />
        <QuickAction to="/admin/products/new" icon={PlusCircle} label="Add a product" tone="espresso" />
        <QuickAction to="/admin/services/new" icon={Gift} label="Add a service" tone="outline" />
      </div>

      {error && <ErrorState description={error} />}

      {!error && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <KpiTile icon={FileClock} label="New bookings" value={stats?.newBookings} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile icon={BadgeCheck} label="Pending quotations" value={stats?.pendingQuotations} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile icon={CalendarRange} label="Confirmed bookings" value={stats?.confirmedBookings} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile icon={CalendarCheck} label="Total bookings" value={stats?.totalBookings} isLoading={isLoading} to="/admin/bookings" />
          <KpiTile icon={ShoppingBag} label="New orders" value={stats?.newOrders} isLoading={isLoading} to="/admin/orders" />
          <KpiTile icon={PackageCheck} label="Total orders" value={stats?.totalOrders} isLoading={isLoading} to="/admin/orders" />
          <KpiTile icon={Users} label="Customers" value={stats?.totalCustomers} isLoading={isLoading} to="/admin/customers" />
          <KpiTile
            icon={Wallet}
            label="Revenue collected"
            value={stats ? formatINR(stats.totalRevenuePaise) : undefined}
            isLoading={isLoading}
            accent
          />
        </motion.div>
      )}
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
  tone,
}: {
  to: string;
  icon: typeof CalendarCheck;
  label: string;
  tone: "gold" | "espresso" | "outline";
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-clay transition-transform active:translate-y-px",
        tone === "gold" && "bg-gold text-white hover:bg-gold-deep",
        tone === "espresso" && "bg-espresso text-white hover:bg-gold",
        tone === "outline" && "border border-line-strong bg-surface text-ink hover:border-espresso",
      )}
    >
      <Icon size={17} strokeWidth={1.75} />
      {label}
    </Link>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  isLoading,
  to,
  accent = false,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: number | string | undefined;
  isLoading: boolean;
  to?: string;
  accent?: boolean;
}) {
  const content = (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex h-full flex-col gap-3 rounded-card border p-5 shadow-clay transition-colors",
        accent ? "border-gold/30 bg-gold/[0.06]" : "border-line bg-surface hover:border-espresso/40",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          accent ? "bg-gold text-white" : "bg-black/[0.04] text-ink/70",
        )}
      >
        <Icon size={17} strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-eyebrow uppercase tracking-[0.1em] text-muted">{label}</p>
        <p className="mt-1 text-display-sm text-ink">
          {isLoading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-black/10" /> : value}
        </p>
      </div>
    </motion.div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}
