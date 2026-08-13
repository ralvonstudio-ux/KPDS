import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/features/cart/CartContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/portfolio", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 px-4 transition-[padding] duration-300 ease-editorial md:px-6", isScrolled ? "pt-2" : "pt-4")}>
      <div className="content-wrap">
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-line bg-canvas/80 shadow-clay backdrop-blur-md transition-[padding] duration-300 ease-editorial md:px-6",
            isScrolled ? "px-3.5 py-2" : "px-4 py-2.5",
          )}
        >
          <NavLink to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight text-ink">
            <span className="text-base">Khatu Pixel</span>
            <span className="hidden text-muted lg:inline">Digital Studio</span>
          </NavLink>

          {/* True center column — full inline nav needs real estate for
              logo + 4 links + 2 icons + CTA; below lg that combination
              wraps ungracefully, so the hamburger covers everything from
              mobile through tablet, not just mobile. */}
          <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-gold",
                    isActive && "text-gold",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center justify-self-end gap-2 lg:flex">
            <NavLink
              to="/cart"
              aria-label={`View cart${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? "" : "s"})` : ""}`}
              className="relative shrink-0 rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-gold"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to={user ? (isAdmin ? "/admin" : "/account") : "/login"}
              className="shrink-0 rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-gold"
              aria-label={user ? "My account" : "Log in"}
            >
              <UserIcon />
            </NavLink>
            <NavLink
              to="/book-your-event"
              className="ml-1 shrink-0 whitespace-nowrap rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-white shadow-clay transition-[background-color,transform] duration-200 active:translate-y-px hover:bg-gold"
            >
              Book Your Event
            </NavLink>
          </div>

          <button
            type="button"
            className="justify-self-end rounded-full p-2 text-ink lg:hidden"
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
              className="mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-surface p-3 shadow-clay lg:hidden"
            >
              {[...links, { to: "/book-your-event", label: "Book Your Event" }].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn("rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-black/[0.04]", isActive && "text-gold")
                  }
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
