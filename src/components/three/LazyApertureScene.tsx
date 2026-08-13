import { lazy, Suspense } from "react";

// Three.js + R3F + Drei is a genuinely heavy bundle (several hundred KB) —
// code-split behind React.lazy so it only downloads for someone who
// actually lands on a page using it, never as part of the main bundle
// every route pays for.
const ApertureScene = lazy(() => import("./ApertureScene").then((m) => ({ default: m.ApertureScene })));

export function LazyApertureScene({ className }: { className?: string }) {
  return (
    <Suspense fallback={null}>
      <ApertureScene className={className} />
    </Suspense>
  );
}
