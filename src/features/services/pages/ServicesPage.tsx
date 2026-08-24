import { motion } from "framer-motion";
import { useServices } from "@/features/services/api";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { FALLBACK_SERVICES } from "@/features/services/components/fallbackServices";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/States";
import { staggerChildren, fadeUp } from "@/lib/motion";

export default function ServicesPage() {
  const { data: services, isLoading, error, refetch } = useServices();
  const hasRealServices = !!services && services.length > 0;
  const cards = hasRealServices ? services : FALLBACK_SERVICES;

  return (
    <div className="page-space content-wrap">
      <PageHeader
        eyebrow="Khatu Pixel Digital Studio"
        title="Studio"
        description="Every package is shaped around your event — see what's included, then talk to us for a quote built around you."
      />

      {error && (
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted">
          Having trouble reaching the live catalogue — showing example services below.{" "}
          <button type="button" onClick={refetch} className="font-medium text-coral underline underline-offset-2 hover:text-coral-deep">
            Try again
          </button>
        </p>
      )}

      <div className="mt-16">
        {isLoading && <LoadingState label="Loading services…" />}
        {!isLoading && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerChildren}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cards.map((service) => (
              <motion.div key={service.id} variants={fadeUp}>
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
