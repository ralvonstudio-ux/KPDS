import { Hero } from "@/features/home/Hero";
import { MarqueeTicker } from "@/features/home/MarqueeTicker";
import { GiftCenterSection } from "@/features/home/GiftCenterSection";
import { StudioSection } from "@/features/home/StudioSection";
import { TestimonialsCarousel } from "@/features/home/TestimonialsCarousel";
import { WhatsAppCta } from "@/features/home/WhatsAppCta";

/**
 * Conventional editorial homepage — Ivory / Navy / Coral, per the studio's
 * own reference design. Scroll order: hero -> offers ticker -> Gift Center
 * (shop) -> Studio (services) -> testimonials -> WhatsApp CTA -> footer
 * (global, in PublicLayout). Matches the nav's own left-to-right order:
 * Gift Center before Studio.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <GiftCenterSection />
      <StudioSection />
      <TestimonialsCarousel />
      <WhatsAppCta />
    </>
  );
}
