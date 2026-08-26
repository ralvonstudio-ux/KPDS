import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="content-wrap grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-serif text-2xl font-medium tracking-tight text-ink">KPDS</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            A creative house in Kanpur, working across personalized gifting and professional photography.
          </p>
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/gift-center" className="text-ink/80 hover:text-ink">Gift Center</Link></li>
            <li><Link to="/studio" className="text-ink/80 hover:text-ink">Studio</Link></li>
            <li><Link to="/portfolio" className="text-ink/80 hover:text-ink">Portfolio</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Talk to KPDS</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
            <li className="flex items-center gap-2">
              <PhoneIcon />
              <a href="tel:+919519342602" className="hover:text-ink">+91 95193 42602</a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon />
              <a href="mailto:hello@kpds.studio" className="hover:text-ink">hello@kpds.studio</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="content-wrap flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} KPDS. All rights reserved. · Kanpur, Uttar Pradesh</p>
          <p>Built by Ralvon.</p>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-coral">
      <path d="M4 5c0 8.284 6.716 15 15 15h1a1 1 0 0 0 1-1v-2.5a1 1 0 0 0-.8-.98l-3.6-.8a1 1 0 0 0-1.03.38l-.9 1.3a12.05 12.05 0 0 1-6.07-6.07l1.3-.9a1 1 0 0 0 .38-1.03l-.8-3.6A1 1 0 0 0 8.5 4H6a1 1 0 0 0-1 1Z" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-coral">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
