import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { fadeUp } from "@/lib/motion";

const STUDIO_IMAGE = "https://picsum.photos/seed/kpds-studio-team/1200/1400";

/** Scene 08 — humanizes the brand: the people and craft behind the work. */
export function StudioScene() {
  return (
    <section className="section-space content-wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
        <TiltCard maxTilt={4} className="aspect-[4/5] overflow-hidden rounded-card-lg shadow-clay-lg">
          <img src={STUDIO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
        </TiltCard>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
        <p className="text-eyebrow uppercase tracking-[0.12em] text-gold">The Studio</p>
        <h2 className="mt-3 text-display-lg uppercase text-ink">
          Built around people.
          <br />
          Driven by stories.
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          Khatu Pixel is a small team of photographers, filmmakers, and editors who treat every
          booking as a collaboration — not a transaction. We plan carefully, shoot with intention,
          and deliver work that holds up years later.
        </p>
        <ButtonLink to="/about" variant="outline" className="mt-8" data-cursor="View">
          About the Studio
        </ButtonLink>
      </motion.div>
    </section>
  );
}
