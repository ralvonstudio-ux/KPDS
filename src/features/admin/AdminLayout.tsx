import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingBag,
  MessageSquare,
  Camera,
  Image,
  GalleryHorizontalEnd,
  FolderTree,
  Gift,
  Users,
  UserCircle,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface AdminNavLink {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}

const groups: { label: string | null; links: AdminNavLink[] }[] = [
  {
    label: null,
    links: [{ to: "/admin", label: "Overview", end: true, icon: LayoutDashboard }],
  },
  {
    label: "Run the studio",
    links: [
      { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { to: "/admin/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Content",
    links: [
      { to: "/admin/hero", label: "Homepage Hero", icon: Image },
      { to: "/admin/services", label: "Services", icon: Camera },
      { to: "/admin/portfolio", label: "Portfolio", icon: GalleryHorizontalEnd },
      { to: "/admin/categories", label: "Categories", icon: FolderTree },
      { to: "/admin/products", label: "Products", icon: Gift },
    ],
  },
  {
    label: "People",
    links: [
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/team", label: "Team", icon: UserCircle },
    ],
  },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <SidebarBrand />
        <SidebarNav className="mt-8" />
        <SidebarFooter profile={profile} onSignOut={handleSignOut} className="mt-auto" />
      </aside>

      <div className="flex-1">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <SidebarBrand compact />
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="rounded-full p-2 text-ink hover:bg-black/[0.04]"
            aria-label="Open admin menu"
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </header>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-obsidian/50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full w-72 flex-col bg-surface px-4 py-6 shadow-clay-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <SidebarBrand />
                  <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-full p-2 text-ink hover:bg-black/[0.04]"
                    aria-label="Close menu"
                  >
                    <X size={20} strokeWidth={1.75} />
                  </button>
                </div>
                <SidebarNav className="mt-8" onNavigate={() => setIsMobileOpen(false)} />
                <SidebarFooter profile={profile} onSignOut={handleSignOut} className="mt-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarBrand({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/admin" className="flex items-center gap-2.5 px-1">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-espresso text-sm font-semibold text-white">
        KP
      </span>
      {!compact && (
        <span>
          <span className="block text-sm font-semibold tracking-tight text-ink">Khatu Pixel</span>
          <span className="block text-xs text-muted">Studio Admin</span>
        </span>
      )}
    </NavLink>
  );
}

function SidebarNav({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <nav className={cn("flex flex-1 flex-col gap-5 overflow-y-auto", className)} aria-label="Admin">
      {groups.map((group, i) => (
        <div key={i}>
          {group.label && (
            <p className="mb-1.5 px-3 text-eyebrow uppercase tracking-[0.1em] text-muted">{group.label}</p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "text-white" : "text-ink/75 hover:bg-black/[0.04] hover:text-ink",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="admin-nav-active"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-espresso"
                      />
                    )}
                    <link.icon size={17} strokeWidth={1.75} className="relative shrink-0" />
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({
  profile,
  onSignOut,
  className,
}: {
  profile: { full_name: string | null } | null;
  onSignOut: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 border-t border-line pt-4", className)}>
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/75 hover:bg-black/[0.04] hover:text-ink"
      >
        <ExternalLink size={17} strokeWidth={1.75} />
        View live site
      </a>
      <div className="flex items-center justify-between rounded-xl px-3 py-2">
        <span className="truncate text-sm text-ink/75">{profile?.full_name || "Admin"}</span>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Sign out"
          className="shrink-0 rounded-full p-1.5 text-ink/50 hover:bg-black/[0.04] hover:text-gold"
        >
          <LogOut size={16} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
