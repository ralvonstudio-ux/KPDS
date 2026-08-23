import { motion } from "framer-motion";
import { useServices } from "@/features/services/api";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { staggerChildren, fadeUp } from "@/lib/motion";

export default function ServicesPage() {
  const { data: services, isLoading, error, refetch } = useServices();

  return (
    <div className="section-space content-wrap">
      <PageHeader
        eyebrow="Khatu Pixel Digital Studio"
        title="Studio"
        description="Every package is shaped around your event — see what's included, then talk to us for a quote built around you."
      />

      <div className="mt-16">
        {isLoading && <LoadingState label="Loading services…" />}
        {error && <ErrorState description={error} onRetry={refetch} />}
        {!isLoading && !error && services && services.length === 0 && (
          <EmptyState
            title="Services are being updated"
            description="Our catalogue is being refreshed — check back shortly, or reach out directly to discuss your event."
          />
        )}
        {!isLoading && !error && services && services.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerChildren}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
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
