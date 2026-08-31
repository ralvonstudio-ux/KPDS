import { Link } from "react-router-dom";
import type { ReactNode } from "react";

// Real routes only — no fabricated pages (no "Client Gallery"/social links
// that don't actually exist on this site). Split into two link cards
// purely for the card-grid layout below; both groups draw from the same
// real router (src/app/router.tsx).
const EXPLORE_LINKS = [
  { to: "/", label: "Home", desc: "Start here" },
  { to: "/studio", label: "Studio", desc: "Photography & videography" },
  { to: "/gift-center", label: "Gift Center", desc: "Personalized gifts" },
  { to: "/portfolio", label: "Portfolio", desc: "Recent work" },
  { to: "/offers", label: "Offers", desc: "Latest deals" },
];

const QUICK_LINKS = [
  { to: "/account", label: "My Account", desc: "Bookings & orders" },
  { to: "/book-your-event", label: "Book Your Event", desc: "Reserve your date" },
  { to: "/login", label: "Log In", desc: "Access your account" },
  { to: "/about", label: "About Us", desc: "Our story" },
  { to: "/contact", label: "Contact Us", desc: "Get in touch" },
];

// Real service/product categories, not invented ones — matches what's
// actually bookable/shoppable on the site today.
const TAGS = ["Wedding Studio", "Cinematic Editing", "Albums & Frames", "Personalized Gifts"];

const CARD = "rounded-card-lg border border-line bg-surface p-6 shadow-clay";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="content-wrap py-16 md:py-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand card */}
          <div className={CARD}>
            <div className="flex items-center gap-3">
              {/* Circular frame built from our own tokens (bg-canvas +
                  border-line + shadow-clay), not a second flattened image
                  — the logo itself still swaps for the dark-mode variant
                  inside it, same as everywhere else, so the frame adapts
                  with the theme instead of being a fixed asset. */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line-strong bg-canvas p-2 shadow-clay">
                <img src="/logo/kpds-full.png" alt="" aria-hidden="true" className="block h-full w-full object-contain dark:hidden" />
                <img src="/logo/kpds-full-dark.png" alt="" aria-hidden="true" className="hidden h-full w-full object-contain dark:block" />
              </div>
              <p className="font-serif text-xl text-ink">KPDS</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Khatu Pixel Digital Studio — wedding stories, cinematic edits and personalized gifting, crafted in Bahraich.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span key={tag} className="rounded-full border border-line-strong px-3 py-1 text-xs text-ink/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Explore card */}
          <div className={CARD}>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Explore</p>
            <ul className="mt-4">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-canvas"
                  >
                    <span className="text-sm font-medium text-ink">{link.label}</span>
                    <span className="text-xs text-muted">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick access card */}
          <div className={CARD}>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Quick Access</p>
            <ul className="mt-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-canvas"
                  >
                    <span className="text-sm font-medium text-ink">{link.label}</span>
                    <span className="text-xs text-muted">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact card */}
          <div className={CARD}>
            <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Contact</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="tel:+919519342602" className="flex items-center gap-3">
                  <IconChip>
                    <PhoneIcon />
                  </IconChip>
                  <span>
                    <span className="block text-sm font-medium text-ink">Call KPDS</span>
                    <span className="block text-xs text-muted">+91 95193 42602</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:+918765575509" className="flex items-center gap-3">
                  <IconChip>
                    <PhoneIcon />
                  </IconChip>
                  <span>
                    <span className="block text-sm font-medium text-ink">Office</span>
                    <span className="block text-xs text-muted">+91 87655 75509</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@kpds.studio" className="flex items-center gap-3">
                  <IconChip>
                    <MailIcon />
                  </IconChip>
                  <span>
                    <span className="block text-sm font-medium text-ink">Email</span>
                    <span className="block text-xs text-muted">hello@kpds.studio</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconChip>
                  <PinIcon />
                </IconChip>
                <span>
                  <span className="block text-sm font-medium text-ink">Studio Address</span>
                  <span className="block text-xs text-muted">
                    Mastan Complex, near KDC Road,
                    <br />
                    Bahraich, Uttar Pradesh – 271801
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="content-wrap flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} KPDS. All rights reserved. · Bahraich, Uttar Pradesh</p>
          <p>Built by Ralvon.</p>
        </div>
      </div>
    </footer>
  );
}

function IconChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
      {children}
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 5c0 8.284 6.716 15 15 15h1a1 1 0 0 0 1-1v-2.5a1 1 0 0 0-.8-.98l-3.6-.8a1 1 0 0 0-1.03.38l-.9 1.3a12.05 12.05 0 0 1-6.07-6.07l1.3-.9a1 1 0 0 0 .38-1.03l-.8-3.6A1 1 0 0 0 8.5 4H6a1 1 0 0 0-1 1Z" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}
