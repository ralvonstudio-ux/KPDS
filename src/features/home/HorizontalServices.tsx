import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useServices } from "@/features/services/api";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

const FALLBACK_PANELS = [
  { title: "Weddings", image: "https://picsum.photos/seed/kpds-h-weddings/1400/1600" },
  { title: "Pre-Weddings", image: "https://picsum.photos/seed/kpds-h-preweddings/1400/1600" },
  { title: "Events", image: "https://picsum.photos/seed/kpds-h-events/1400/1600" },
  { title: "Cinematic Films", image: "https://picsum.photos/seed/kpds-h-films/1400/1600" },
  { title: "Drone", image: "https://picsum.photos/seed/kpds-h-drone/1400/1600" },
];

/**
 * Scene 06/07 — services told as chapters, moved through horizontally.
 * Merges what the brief describes as two separate scenes (a vertical
 * "services story" sequence, then a pinned horizontal panel experience) —
 * both walk through the same five categories back to back, which would
 * just repeat itself on a real visit. One horizontal chapter experience
 * carries both intents: each panel already reads as a "chapter" as you
 * move through it.
 *
 * Deliberately built on native `position: sticky` + a scrubbed translateX,
 * NOT GSAP's JS-driven `pin: true`. Confirmed by direct testing that
 * ScrollTrigger's pin mechanism fights Lenis's virtual scroll here — the
 * page scrolled itself away within seconds with pin:true, reproducibly,
 * and disappeared the moment this section was removed. Sticky positioning
 * is native browser behavior Lenis never has to fight with; ScrollTrigger
 * only ever reads scroll progress here, it never drives scroll itself.
 */
export function HorizontalServices() {
  const { data: services } = useServices(5);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const panels =
    services && services.length > 0
      ? services.map((s) => ({ title: s.title, image: s.cover_image_url, to: `/services/${s.slug}` }))
      : FALLBACK_PANELS.map((p) => ({ ...p, to: "/services" }));

  useEffect(() => {
    if (prefersReducedMotion() || !wrapperRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, [panels.length]);

  // Under reduced motion, skip the horizontal treatment entirely and just
  // stack the panels — same content, no scroll-driven movement.
  if (prefersReducedMotion()) {
    return (
      <section className="flex flex-col gap-4 bg-espresso px-4 py-16">
        {panels.map((panel, i) => (
          <ServicePanel key={panel.title} index={i} panel={panel} />
        ))}
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative bg-espresso" style={{ height: `${panels.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max">
          {panels.map((panel, i) => (
            <ServicePanel key={panel.title} index={i} panel={panel} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicePanel({ index, panel }: { index: number; panel: { title: string; image: string | null; to: string } }) {
  return (
    <Link
      to={panel.to}
      data-cursor="View"
      className="group relative flex h-full w-[80vw] shrink-0 items-end overflow-hidden border-r border-white/10 p-8 sm:w-[60vw] md:w-[45vw] md:p-12 lg:w-[38vw]"
    >
      <div className="absolute inset-0 bg-obsidian">
        {panel.image && (
          <img
            src={panel.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
      <div className="relative">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-soft">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-2 text-display-md uppercase text-white">{panel.title}</h3>
      </div>
    </Link>
  );
}
