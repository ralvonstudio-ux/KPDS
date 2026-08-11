import { AuthProvider } from "@/context/AuthContext";

/**
 * Temporary bootstrap screen for Day 1 of the build.
 * Replaced by the full router (public site + customer/admin shells) in the
 * next phase — see docs/information-architecture.md for the route map.
 */
export default function App() {
  return (
    <AuthProvider>
      <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="max-w-md text-center">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-gold">Khatu Pixel Digital Studio</p>
          <h1 className="mt-4 text-display-sm text-ink">
            Capturing moments.
            <br />
            Creating memories.
          </h1>
          <p className="mt-4 text-muted">
            Foundation build in progress — design tokens, Supabase schema, and auth are wired up.
            The public site, booking flow, shop, and dashboards land next.
          </p>
        </div>
      </main>
    </AuthProvider>
  );
}
