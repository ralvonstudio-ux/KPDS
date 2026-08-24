import { ButtonLink } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="page-space content-wrap flex flex-col items-center text-center">
      <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">404</p>
      <h1 className="mt-3 text-display-md text-ink">Page not found</h1>
      <p className="mt-4 max-w-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
      <ButtonLink to="/" variant="outline" className="mt-8">
        Back to Home
      </ButtonLink>
    </div>
  );
}
