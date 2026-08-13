import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

export const HERO_IMAGE = "https://picsum.photos/seed/kpds-cinematic-hero/1800/2200";

/**
 * Scene 01 — full-bleed cinematic hero. Scroll drives the whole scene via
 * one scrubbed GSAP timeline (never idle-animated on the same properties —
 * mixing a looping Framer idle animation with a GSAP scroll-scrub on the
 * same transform would fight every frame): the image scales up slowly,
 * the headline drifts upward and fades, the supporting copy fades faster
 * so it's gone well before the headline, matching the 0/20/40/60% beats
 * described in the brief.
 */
export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      tl.to(imageRef.current, { scale: 1.18, ease: "none" }, 0)
        .to(headlineRef.current, { yPercent: -22, opacity: 0, ease: "none" }, 0)
        .to(subRef.current, { opacity: 0, ease: "none" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-espresso">
      <div ref={imageRef} className="absolute inset-0">
        <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-obsidian/40" />
      </div>

      <div className="relative flex h-full flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
        <div className="content-wrap w-full">
          <div ref={headlineRef}>
            <p className="text-eyebrow uppercase tracking-[0.16em] text-gold-soft">Khatu Pixel / Digital Studio</p>
            <h1 className="mt-4 text-display-xl uppercase text-white">
              Your moments.
              <br />
              Our frame.
            </h1>
          </div>
          <div ref={subRef} className="mt-6 flex flex-wrap items-center gap-4">
            <p className="max-w-xs text-sm text-white/70 md:text-base">
              Photography, film, and craftsmanship for the moments worth keeping.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink to="/book-your-event" variant="gold" size="lg" data-cursor="Open">
                Book Your Event
              </ButtonLink>
              <ButtonLink
                to="/portfolio"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:border-white"
                data-cursor="View"
              >
                View Our Work
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
