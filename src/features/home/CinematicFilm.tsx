import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

const FILM_IMAGE = "https://picsum.photos/seed/kpds-cinematic-film/1800/1100";

/**
 * Scene 05 — an immersive, trailer-like moment. Built as an image today
 * (no video asset exists yet — see docs/handover.md) but structured so a
 * real .mp4 drops in as a straight swap: replace the <img> with a <video
 * autoPlay muted loop playsInline poster={FILM_IMAGE}> and the same
 * container/overlay/GSAP scale wiring around it keeps working unchanged.
 * Skips heavy media entirely under prefers-reduced-motion — the scale
 * stays static.
 */
export function CinematicFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[85vh] w-full overflow-hidden bg-espresso">
      <div ref={mediaRef} className="absolute inset-0">
        <img src={FILM_IMAGE} alt="" className="h-full w-full object-cover opacity-80" loading="lazy" />
        <div className="absolute inset-0 bg-obsidian/55" />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-display-lg uppercase text-white">We don't just take photos.</p>
        <p className="mt-2 text-display-lg uppercase text-gold-soft">We preserve the feeling.</p>
      </div>
    </section>
  );
}
