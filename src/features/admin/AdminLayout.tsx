import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/team", label: "Team" },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-surface px-4 py-6 md:block">
        <p className="px-2 text-sm font-semibold tracking-tight text-ink">Khatu Pixel Admin</p>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-espresso text-white" : "text-ink/80 hover:bg-black/[0.04]",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
          <p className="text-sm font-semibold text-ink">Khatu Pixel Admin</p>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-4 py-2 md:hidden" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-espresso text-white" : "text-ink/80",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
