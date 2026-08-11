import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const links = [
  { to: "/account", label: "Overview", end: true },
  { to: "/account/bookings", label: "My Bookings" },
  { to: "/account/orders", label: "My Orders" },
  { to: "/account/profile", label: "Profile" },
];

export function AccountLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <div className="content-wrap flex-1 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          <aside className="md:sticky md:top-28 md:h-fit">
            <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible" aria-label="Account">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-espresso text-white" : "text-ink/80 hover:bg-black/[0.04]",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
