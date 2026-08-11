import { ButtonLink } from "@/components/ui/Button";

/**
 * Temporary placeholder for routes not yet built out in this phase of the
 * build plan (see docs/build-plan.md). Every route using this must be
 * replaced with the real page before launch — tracked in that plan.
 */
export function ComingSoonPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-space content-wrap flex flex-col items-center text-center">
      <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">{eyebrow}</p>
      <h1 className="mt-3 max-w-xl text-display-md text-ink">{title}</h1>
      <p className="mt-4 max-w-md text-muted">{description}</p>
      <ButtonLink to="/" variant="outline" className="mt-8">
        Back to Home
      </ButtonLink>
    </div>
  );
}
