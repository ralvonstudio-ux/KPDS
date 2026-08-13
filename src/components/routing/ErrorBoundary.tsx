import { Component, type ErrorInfo, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Catches render-time crashes anywhere in the tree below it and shows a
 * calm recovery screen instead of a blank white page. Route changes reset
 * it automatically (App remounts this per top-level render), so a broken
 * page never permanently strands the user. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Unhandled error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-gold-deep">Something went wrong</p>
          <h1 className="mt-3 text-display-sm text-ink">This page hit a snag</h1>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Our team has been notified. Try refreshing, or head back to the homepage.
          </p>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-white hover:bg-ink"
            >
              Refresh
            </button>
            <ButtonLink to="/" variant="outline">
              Back to Home
            </ButtonLink>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
