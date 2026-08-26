import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";
import { ErrorBoundary } from "@/components/routing/ErrorBoundary";
import { SmoothScroll } from "@/lib/SmoothScroll";
import { AppRouter } from "@/app/router";

export default function App() {
  return (
    <ErrorBoundary>
      {/* Makes every framer-motion animation in the app honor OS-level
          prefers-reduced-motion automatically (whileInView reveals,
          hover/tap animations, etc.) — previously only true by accident
          for the handful of places that checked prefersReducedMotion()
          manually. */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <SmoothScroll>
                    <AppRouter />
                  </SmoothScroll>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
