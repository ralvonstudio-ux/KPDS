import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/ui/States";

/**
 * Gate for any route that needs a signed-in user, optionally restricted to a
 * specific role. Never flashes protected content or fires a redirect before
 * the session/profile has finished resolving.
 */
export function ProtectedRoute({
  role,
  children,
}: {
  role?: "customer" | "admin";
  children: ReactNode;
}) {
  const { user, role: userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Checking your session…" />;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (role === "admin" && userRole !== "admin") {
    // Signed in, just not authorized for this area — send them to their own
    // dashboard rather than back to /login.
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
