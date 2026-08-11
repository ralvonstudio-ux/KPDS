import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="content-wrap">
        <div className="flex items-center justify-between rounded-full border border-line bg-canvas/80 px-4 py-2.5 shadow-clay backdrop-blur-md md:px-6">
          <NavLink to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-ink">
            <span className="text-base">Khatu Pixel</span>
            <span className="hidden text-muted sm:inline">Digital Studio</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink",
                    isActive && "text-ink",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              to="/cart"
              aria-label="View cart"
              className="rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-ink"
            >
              <CartIcon />
            </NavLink>
            <NavLink
              to={user ? (isAdmin ? "/admin" : "/account") : "/login"}
              className="rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-ink"
              aria-label={user ? "My account" : "Log in"}
            >
              <UserIcon />
            </NavLink>
            <NavLink
              to="/book-your-event"
              className="ml-1 rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-white shadow-clay transition-transform active:translate-y-px hover:bg-ink"
            >
              Book Your Event
            </NavLink>
          </div>

          <button
            type="button"
            className="rounded-full p-2 text-ink md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              aria-label="Mobile"
              className="mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-surface p-3 shadow-clay md:hidden"
            >
              {[...links, { to: "/book-your-event", label: "Book Your Event" }].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-black/[0.04]"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-1 flex gap-2 border-t border-line pt-3">
                <NavLink
                  to="/cart"
                  className="flex-1 rounded-xl border border-line-strong px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  Cart
                </NavLink>
                <NavLink
                  to={user ? (isAdmin ? "/admin" : "/account") : "/login"}
                  className="flex-1 rounded-xl border border-line-strong px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  {user ? "Account" : "Log in"}
                </NavLink>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20.5" r="1.25" />
      <circle cx="17.5" cy="20.5" r="1.25" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}
