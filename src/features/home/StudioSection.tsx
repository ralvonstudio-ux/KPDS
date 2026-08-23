import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useServices } from "@/features/services/api";
import { formatINR } from "@/lib/utils";
import { fadeUp, staggerChildren, imageZoomHover } from "@/lib/motion";
import { LoadingState } from "@/components/ui/States";

/** "KPDS Studio" — the photography/videography side of the business. */
export function StudioSection() {
  const { data: services, isLoading } = useServices(4);

  if (isLoading) return <LoadingState label="Loading the studio…" />;
  if (!services || services.length === 0) return null;

  return (
    <section className="section-space content-wrap">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">KPDS Studio</p>
          <h2 className="mt-3 font-serif text-display-lg text-ink">We frame your story.</h2>
        </div>
        <Link to="/studio" className="text-sm font-medium text-coral hover:text-coral-deep">
          Explore Studio →
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren}
        className="mt-10 flex gap-5 overflow-x-auto pb-2"
      >
        {services.map((service) => (
          <motion.div key={service.id} variants={fadeUp} className="w-52 shrink-0 sm:w-60">
            <Link
              to={`/studio/${service.slug}`}
              className="group block overflow-hidden rounded-card-lg border border-transparent shadow-clay transition-[border-color] duration-200 hover:border-coral focus-visible:outline-none focus-visible:border-coral"
            >
              <div className="aspect-[3/4] overflow-hidden bg-black/5">
                {service.cover_image_url ? (
                  <motion.img
                    {...imageZoomHover}
                    src={service.cover_image_url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted">Image coming soon</div>
                )}
              </div>
              <div className="bg-surface p-5">
                <h3 className="font-serif text-lg text-ink">{service.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {service.is_custom_quote || !service.starting_price_paise
                    ? "Custom Quote"
                    : `From ${formatINR(service.starting_price_paise)}`}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
