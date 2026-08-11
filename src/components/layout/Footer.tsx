import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="content-wrap grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-20">
        <div>
          <p className="text-base font-semibold tracking-tight text-ink">Khatu Pixel Digital Studio</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Photography, videography, and customised gifts — capturing moments, creating memories.
          </p>
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/services" className="text-ink/80 hover:text-ink">Services</Link></li>
            <li><Link to="/portfolio" className="text-ink/80 hover:text-ink">Portfolio</Link></li>
            <li><Link to="/shop" className="text-ink/80 hover:text-ink">Shop</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Studio</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="text-ink/80 hover:text-ink">About</Link></li>
            <li><Link to="/book-your-event" className="text-ink/80 hover:text-ink">Book Your Event</Link></li>
            <li><Link to="/contact" className="text-ink/80 hover:text-ink">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Get in touch</p>
          {/* Placeholder contact details — replace with the studio's real details during handover. */}
          <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
            <li>hello@khatupixel.studio</li>
            <li>+91 00000 00000</li>
            <li>Khatu, Rajasthan</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="content-wrap flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Khatu Pixel Digital Studio. All rights reserved.</p>
          <p>Built by Ralvon.</p>
        </div>
      </div>
    </footer>
  );
}
