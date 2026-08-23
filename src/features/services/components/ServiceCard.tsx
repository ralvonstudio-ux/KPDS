import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Service } from "@/features/services/api";
import { formatINR } from "@/lib/utils";
import { imageZoomHover } from "@/lib/motion";
import { TiltCard } from "@/components/ui/TiltCard";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <TiltCard maxTilt={4} className={className}>
      <Link
        to={`/studio/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-clay focus-visible:outline-none focus-visible:shadow-focus"
      >
        <div className="aspect-[4/5] overflow-hidden bg-black/5">
          {service.cover_image_url ? (
            <motion.img
              {...imageZoomHover}
              src={service.cover_image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              Image coming soon
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <h3 className="text-lg font-medium text-ink">{service.title}</h3>
          {service.summary && <p className="text-sm text-muted line-clamp-2">{service.summary}</p>}
          <p className="mt-auto pt-3 text-sm font-medium text-gold-deep">
            {service.is_custom_quote || !service.starting_price_paise
              ? "Custom Quote Available"
              : `Starting From ${formatINR(service.starting_price_paise)}`}
          </p>
        </div>
      </Link>
    </TiltCard>
  );
}
