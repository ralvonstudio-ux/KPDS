import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";
import { ErrorBoundary } from "@/components/routing/ErrorBoundary";
import { SmoothScroll } from "@/lib/SmoothScroll";
import { AppRouter } from "@/app/router";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>
              <AppRouter />
            </SmoothScroll>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
