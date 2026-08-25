import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

// Placeholder WhatsApp number — replace with the studio's real business
// number during handover (matches the placeholder in Footer.tsx).
const WHATSAPP_NUMBER = "919839000000";
const WHATSAPP_MESSAGE = "Hi KPDS! I'd like to talk through an idea for my event/gift.";

export function WhatsAppCta() {
  return (
    <section className="content-wrap pb-16 md:pb-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="flex flex-col items-start justify-between gap-6 rounded-card-lg border border-line bg-surface p-8 shadow-neu md:flex-row md:items-center md:p-10"
      >
        <div>
          <h3 className="font-serif text-2xl text-ink">Prefer to just talk it through?</h3>
          <p className="mt-2 text-sm text-muted">Tell us what you're planning and we'll take it from there.</p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-white shadow-clay transition-colors hover:bg-espresso-deep"
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>
      </motion.div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.6.6-.8 1.3-.8 2.1.1.9.5 1.8 1.1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2.9.4 1.4.5.6.2 1.1.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}
