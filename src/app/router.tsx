import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AccountLayout } from "@/features/account/AccountLayout";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { ComingSoonPage } from "@/components/layout/ComingSoonPage";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";

import ServicesPage from "@/features/services/pages/ServicesPage";
import ServiceDetailPage from "@/features/services/pages/ServiceDetailPage";
import PortfolioPage from "@/features/portfolio/pages/PortfolioPage";
import BookEventPage from "@/features/booking/pages/BookEventPage";

import ShopHomePage from "@/features/shop/pages/ShopHomePage";
import ShopCategoryPage from "@/features/shop/pages/ShopCategoryPage";
import ProductDetailPage from "@/features/shop/pages/ProductDetailPage";
import CartPage from "@/features/cart/pages/CartPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import CheckoutSuccessPage from "@/features/checkout/pages/CheckoutSuccessPage";
import CheckoutFailedPage from "@/features/checkout/pages/CheckoutFailedPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import AccountOverviewPage from "@/features/account/pages/AccountOverviewPage";
import AdminOverviewPage from "@/features/admin/pages/AdminOverviewPage";

import AdminServicesListPage from "@/features/admin/services/pages/AdminServicesListPage";
import AdminServiceEditPage from "@/features/admin/services/pages/AdminServiceEditPage";
import AdminPortfolioListPage from "@/features/admin/portfolio/pages/AdminPortfolioListPage";
import AdminPortfolioEditPage from "@/features/admin/portfolio/pages/AdminPortfolioEditPage";
import AdminCategoriesPage from "@/features/admin/categories/pages/AdminCategoriesPage";
import AdminProductsListPage from "@/features/admin/products/pages/AdminProductsListPage";
import AdminProductEditPage from "@/features/admin/products/pages/AdminProductEditPage";
import AdminBookingsListPage from "@/features/admin/bookings/pages/AdminBookingsListPage";
import AdminBookingDetailPage from "@/features/admin/bookings/pages/AdminBookingDetailPage";
import AdminTeamPage from "@/features/admin/team/pages/AdminTeamPage";
import AdminOrdersListPage from "@/features/admin/orders/pages/AdminOrdersListPage";
import AdminOrderDetailPage from "@/features/admin/orders/pages/AdminOrderDetailPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/shop" element={<ShopHomePage />} />
        <Route path="/shop/product/:slug" element={<ProductDetailPage />} />
        <Route path="/shop/:categorySlug" element={<ShopCategoryPage />} />
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
        <Route
          path="/account/profile"
          element={<ComingSoonPage eyebrow="Account" title="Profile management coming soon" description="Editing your name, phone, and password lands with the customer dashboard build." />}
        />
        <Route
          path="/account/bookings"
          element={<ComingSoonPage eyebrow="Account" title="My Bookings coming soon" description="Your bookings, quotations, and payment history land with the customer dashboard build." />}
        />
        <Route
          path="/account/bookings/:id"
          element={<ComingSoonPage eyebrow="Account" title="Booking detail coming soon" description="Quotation, timeline, and balance payment land with the customer dashboard build." />}
        />
        <Route
          path="/account/orders"
          element={<ComingSoonPage eyebrow="Account" title="My Orders coming soon" description="Your shop orders and tracking land with the customer dashboard build." />}
        />
        <Route
          path="/account/orders/:id"
          element={<ComingSoonPage eyebrow="Account" title="Order detail coming soon" description="Order items and status timeline land with the customer dashboard build." />}
        />
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
        <Route path="/admin/services" element={<AdminServicesListPage />} />
        <Route path="/admin/services/:id" element={<AdminServiceEditPage />} />
        <Route path="/admin/portfolio" element={<AdminPortfolioListPage />} />
        <Route path="/admin/portfolio/:id" element={<AdminPortfolioEditPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/products" element={<AdminProductsListPage />} />
        <Route path="/admin/products/:id" element={<AdminProductEditPage />} />
        <Route path="/admin/orders" element={<AdminOrdersListPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
        <Route
          path="/admin/customers"
          element={<ComingSoonPage eyebrow="Admin" title="Customer list coming soon" description="This module lands in the admin operations phase of the build." />}
        />
        <Route path="/admin/team" element={<AdminTeamPage />} />
      </Route>
    </Routes>
  );
}
