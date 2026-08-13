import { useState } from "react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CinematicHero, HERO_IMAGE } from "@/features/home/CinematicHero";
import { EditorialStatement } from "@/features/home/EditorialStatement";
import { BentoExperience } from "@/features/home/BentoExperience";
import { PortfolioScene } from "@/features/home/PortfolioScene";
import { CinematicFilm } from "@/features/home/CinematicFilm";
import { HorizontalServices } from "@/features/home/HorizontalServices";
import { StudioScene } from "@/features/home/StudioScene";
import { TestimonialsScene } from "@/features/home/TestimonialsScene";
import { ShopTransition } from "@/features/home/ShopTransition";
import { BookEventCta } from "@/features/home/BookEventCta";
import { ScrollTrigger } from "@/lib/gsapSetup";

/**
 * The homepage as a scroll-driven cinematic narrative rather than a
 * conventional hero/services/cards/footer landing page — see
 * docs/design-system.md and docs/build-plan.md for the full brief this
 * follows. Scene order: hero -> editorial statement -> bento -> portfolio
 * -> cinematic film -> horizontal services chapters -> studio ->
 * testimonials -> shop transition -> book-event CTA -> footer (global).
 */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen
          imageSrc={HERO_IMAGE}
          onDone={() => {
            setIsLoading(false);
            // The pinned horizontal section and every scrubbed scene above
            // measure real layout — the loading screen covering the page
            // while fonts/images settle can leave those measurements
            // stale, so re-measure once it's actually gone.
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }}
        />
      )}
      <CustomCursor />
      <div>
        <CinematicHero />
        <EditorialStatement />
        <BentoExperience />
        <PortfolioScene />
        <CinematicFilm />
        <HorizontalServices />
        <StudioScene />
        <TestimonialsScene />
        <ShopTransition />
        <BookEventCta />
      </div>
    </>
  );
}
