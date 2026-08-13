import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * Scene 02 — a single line of enormous editorial type, revealed as one
 * cinematic composition (not word-by-word) as it scrolls into view.
 */
export function EditorialStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { opacity: 0.12, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 30%", scrub: 0.5 },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-canvas py-28 text-center md:py-40">
      <div className="content-wrap">
        <p ref={lineRef} className="mx-auto max-w-4xl text-display-lg uppercase text-ink">
          Every frame holds a <span className="text-gold">story.</span>
        </p>
      </div>
    </section>
  );
}
