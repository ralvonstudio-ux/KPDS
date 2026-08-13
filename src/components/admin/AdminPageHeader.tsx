import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
        <h1 className="mt-1 text-display-sm text-ink">{title}</h1>
      </div>
      {action}
    </div>
  );
}
