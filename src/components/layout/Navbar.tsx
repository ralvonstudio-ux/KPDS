import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/features/cart/CartContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/gift-center", label: "Gift Center" },
  { to: "/studio", label: "Studio" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/offers", label: "Offers" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-md">
      <div className="content-wrap flex items-center gap-6 py-4">
        <NavLink to="/" className="shrink-0 py-1" aria-label="Khatu Pixel Digital Studio — home">
          {/* Full lockup — icon + "KPDS" above the "Khatu Pixel Digital
              Studio" wordmark (public/logo/kpds-full.png, built by
              public/logo/build-full-logo.mjs). Background-removed with the
              same technique as kpds-mark.png — no white box, sits directly
              on the page. This is a stacked/vertical mark rather than a
              single text line, so unlike the old icon-only navbar logo it
              doesn't need a baseline-alignment offset — it just centers as
              one self-contained unit, same as any other navbar item. Dark
              mode uses a flat white silhouette (brightness-0 + invert)
              rather than a second hand-authored asset. */}
          <img
            src="/logo/kpds-full.png"
            alt="Khatu Pixel Digital Studio"
            className="h-14 w-auto dark:brightness-0 dark:invert"
          />
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-ink/75 transition-colors hover:text-coral",
                  isActive && "text-coral",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <span
            title="Multi-location support is coming soon"
            className="flex cursor-default items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 py-2 text-sm text-ink/80"
          >
            <PinIcon />
            Set location
          </span>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-coral"
          >
            <SearchIcon />
          </button>

          <NavLink
            to="/cart"
            aria-label={`View cart${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? "" : "s"})` : ""}`}
            className="relative shrink-0 rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-coral"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to={user ? (isAdmin ? "/admin" : "/account") : "/login"}
            className="shrink-0 rounded-full p-2.5 text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-coral"
            aria-label={user ? "My account" : "Log in"}
          >
            <UserIcon />
          </NavLink>

          <ThemeToggle />

          <NavLink
            to="/book-your-event"
            className="skeu-btn-primary ml-1 shrink-0 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Book
          </NavLink>
        </div>

        <button
          type="button"
          className="ml-auto rounded-full p-2 text-ink lg:hidden"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Mobile"
            className="overflow-hidden border-t border-line bg-canvas lg:hidden"
          >
            <div className="content-wrap flex flex-col gap-1 py-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn("rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-black/[0.04]", isActive && "text-coral")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-line pt-3">
                <ThemeToggle />
                <div className="flex gap-2">
                  <NavLink to="/cart" className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium text-ink">
                    Cart{itemCount > 0 ? ` (${itemCount})` : ""}
                  </NavLink>
                  <NavLink
                    to={user ? (isAdmin ? "/admin" : "/account") : "/login"}
                    className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium text-ink"
                  >
                    {user ? "Account" : "Log in"}
                  </NavLink>
                </div>
              </div>
              <NavLink
                to="/book-your-event"
                className="skeu-btn-primary mt-2 rounded-full px-6 py-3 text-center text-sm font-semibold"
              >
                Book Your Event
              </NavLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
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
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-coral">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}
