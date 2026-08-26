import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AccountLayout } from "@/features/account/AccountLayout";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { LoadingState } from "@/components/ui/States";

import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Everything below is route-level code-split: the home page (the most
// common first paint) stays in the main bundle, the rest — including the
// entire admin console, which an anonymous visitor never needs — loads on
// demand. See docs/build-plan.md for the bundle-size note this replaces.
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

const ServicesPage = lazy(() => import("@/features/services/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/features/services/pages/ServiceDetailPage"));
const PortfolioPage = lazy(() => import("@/features/portfolio/pages/PortfolioPage"));
const OffersPage = lazy(() => import("@/pages/OffersPage"));
const BookEventPage = lazy(() => import("@/features/booking/pages/BookEventPage"));

const ShopHomePage = lazy(() => import("@/features/shop/pages/ShopHomePage"));
const ShopCategoryPage = lazy(() => import("@/features/shop/pages/ShopCategoryPage"));
const ProductDetailPage = lazy(() => import("@/features/shop/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/features/checkout/pages/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("@/features/checkout/pages/CheckoutSuccessPage"));
const CheckoutFailedPage = lazy(() => import("@/features/checkout/pages/CheckoutFailedPage"));

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));

const AccountOverviewPage = lazy(() => import("@/features/account/pages/AccountOverviewPage"));
const AccountProfilePage = lazy(() => import("@/features/account/profile/pages/AccountProfilePage"));
const AccountBookingsListPage = lazy(() => import("@/features/account/bookings/pages/AccountBookingsListPage"));
const AccountBookingDetailPage = lazy(() => import("@/features/account/bookings/pages/AccountBookingDetailPage"));
const AccountOrdersListPage = lazy(() => import("@/features/account/orders/pages/AccountOrdersListPage"));
const AccountOrderDetailPage = lazy(() => import("@/features/account/orders/pages/AccountOrderDetailPage"));

const AdminOverviewPage = lazy(() => import("@/features/admin/pages/AdminOverviewPage"));
const AdminServicesListPage = lazy(() => import("@/features/admin/services/pages/AdminServicesListPage"));
const AdminServiceEditPage = lazy(() => import("@/features/admin/services/pages/AdminServiceEditPage"));
const AdminPortfolioListPage = lazy(() => import("@/features/admin/portfolio/pages/AdminPortfolioListPage"));
const AdminPortfolioEditPage = lazy(() => import("@/features/admin/portfolio/pages/AdminPortfolioEditPage"));
const AdminCategoriesPage = lazy(() => import("@/features/admin/categories/pages/AdminCategoriesPage"));
const AdminProductsListPage = lazy(() => import("@/features/admin/products/pages/AdminProductsListPage"));
const AdminProductEditPage = lazy(() => import("@/features/admin/products/pages/AdminProductEditPage"));
const AdminBookingsListPage = lazy(() => import("@/features/admin/bookings/pages/AdminBookingsListPage"));
const AdminMessagesListPage = lazy(() => import("@/features/admin/messages/pages/AdminMessagesListPage"));
const AdminHeroImagesListPage = lazy(() => import("@/features/admin/hero/pages/AdminHeroImagesListPage"));
const AdminBookingDetailPage = lazy(() => import("@/features/admin/bookings/pages/AdminBookingDetailPage"));
const AdminTeamPage = lazy(() => import("@/features/admin/team/pages/AdminTeamPage"));
const AdminOrdersListPage = lazy(() => import("@/features/admin/orders/pages/AdminOrdersListPage"));
const AdminOrderDetailPage = lazy(() => import("@/features/admin/orders/pages/AdminOrderDetailPage"));
const AdminCustomersPage = lazy(() => import("@/features/admin/customers/pages/AdminCustomersPage"));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/studio" element={<ServicesPage />} />
          <Route path="/studio/:slug" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/gift-center" element={<ShopHomePage />} />
          <Route path="/gift-center/product/:slug" element={<ProductDetailPage />} />
          <Route path="/gift-center/:categorySlug" element={<ShopCategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/book-your-event"
            element={
              <ProtectedRoute>
                <BookEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                <CheckoutSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout/failed" element={<CheckoutFailedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/account" element={<AccountOverviewPage />} />
          <Route path="/account/profile" element={<AccountProfilePage />} />
          <Route path="/account/bookings" element={<AccountBookingsListPage />} />
          <Route path="/account/bookings/:id" element={<AccountBookingDetailPage />} />
          <Route path="/account/orders" element={<AccountOrdersListPage />} />
          <Route path="/account/orders/:id" element={<AccountOrderDetailPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsListPage />} />
          <Route path="/admin/bookings/:id" element={<AdminBookingDetailPage />} />
          <Route path="/admin/messages" element={<AdminMessagesListPage />} />
          <Route path="/admin/hero" element={<AdminHeroImagesListPage />} />
          <Route path="/admin/services" element={<AdminServicesListPage />} />
          <Route path="/admin/services/:id" element={<AdminServiceEditPage />} />
          <Route path="/admin/portfolio" element={<AdminPortfolioListPage />} />
          <Route path="/admin/portfolio/:id" element={<AdminPortfolioEditPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/products" element={<AdminProductsListPage />} />
          <Route path="/admin/products/:id" element={<AdminProductEditPage />} />
          <Route path="/admin/orders" element={<AdminOrdersListPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/team" element={<AdminTeamPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
