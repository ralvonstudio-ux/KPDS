import { BrowserRouter } from "react-router-dom";
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
    </ErrorBoundary>
  );
}
