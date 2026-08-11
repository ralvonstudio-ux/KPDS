import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useService } from "@/features/services/api";
import { ButtonLink } from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { formatINR } from "@/lib/utils";
import { fadeUp, imageZoomHover } from "@/lib/motion";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useService(slug);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (isLoading) return <LoadingState label="Loading service…" />;
  if (error) return <ErrorState description={error} />;
  if (!service) {
    return (
      <div className="section-space content-wrap">
        <EmptyState
          title="Service not found"
          description="This service may have been renamed or is no longer offered."
          action={
            <ButtonLink to="/services" variant="outline" className="mt-2">
              Back to Services
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const gallery = service.service_gallery ?? [];

  return (
    <article>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5 md:aspect-[21/9]">
        {service.cover_image_url && (
          <img src={service.cover_image_url} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 pb-10">
          <div className="content-wrap">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-2xl text-display-md text-white"
            >
              {service.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="section-space content-wrap grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          {service.description && (
            <p className="whitespace-pre-line text-base leading-relaxed text-ink/90">{service.description}</p>
          )}

          {service.deliverables.length > 0 && (
            <div className="mt-10">
              <h2 className="text-display-sm text-ink">What's included</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink/90">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mt-14">
              <h2 className="text-display-sm text-ink">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((img) => (
                  <motion.div key={img.id} className="aspect-square overflow-hidden rounded-card bg-black/5">
                    <motion.img
                      {...imageZoomHover}
                      src={img.image_url}
                      alt={img.caption ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(service.faqs) && service.faqs.length > 0 && (
            <div className="mt-14">
              <h2 className="text-display-sm text-ink">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-line rounded-card border border-line bg-surface">
                {service.faqs.map((faq, i) => (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      aria-expanded={activeFaq === i}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink"
                    >
                      {faq.question}
                      <span className="text-muted">{activeFaq === i ? "−" : "+"}</span>
                    </button>
                    {activeFaq === i && <p className="px-5 pb-4 text-sm text-muted">{faq.answer}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-card-lg border border-line bg-surface p-6 shadow-clay lg:sticky lg:top-28">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">Pricing</p>
          <p className="mt-2 text-display-sm text-ink">
            {service.is_custom_quote || !service.starting_price_paise
              ? "Custom Quote Available"
              : `From ${formatINR(service.starting_price_paise)}`}
          </p>
          <p className="mt-2 text-sm text-muted">
            Final pricing is negotiated for every event based on scope, location, and deliverables.
          </p>
          <ButtonLink to={`/book-your-event?service=${service.slug}`} variant="gold" className="mt-6 w-full">
            Book Your Event
          </ButtonLink>
        </aside>
      </div>
    </article>
  );
}
