import { ButtonLink } from "@/components/ui/Button";

/** Scene 10 — the strongest CTA on the site. Dark, direct, no ambiguity. */
export function BookEventCta() {
  return (
    <section className="bg-espresso py-24 text-center md:py-32">
      <div className="content-wrap">
        <h2 className="text-display-xl uppercase text-canvas">
          Your date.
          <br />
          Your story.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink to="/book-your-event" variant="gold" size="lg" data-cursor="Open">
            Book Your Event →
          </ButtonLink>
          <ButtonLink
            to="/contact"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:border-white"
            data-cursor="Open"
          >
            Talk to Us →
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
