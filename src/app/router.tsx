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

import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import AccountOverviewPage from "@/features/account/pages/AccountOverviewPage";
import AdminOverviewPage from "@/features/admin/pages/AdminOverviewPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route
          path="/shop"
          element={
            <ComingSoonPage
              eyebrow="Shop"
              title="The gift boutique is being curated"
              description="Ready-made and customised gifts land in the next phase of the build."
            />
          }
        />
        <Route
          path="/shop/product/:slug"
          element={<ComingSoonPage eyebrow="Shop" title="Product page coming soon" description="Product detail pages land in the next phase of the build." />}
        />
        <Route
          path="/cart"
          element={<ComingSoonPage eyebrow="Cart" title="Your cart is being built" description="Cart and checkout land alongside the shop." />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/book-your-event"
          element={
            <ProtectedRoute>
              <BookEventPage />
            </ProtectedRoute>
          }
        />
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
          element={<ComingSoonPage eyebrow="Account" title="My Bookings coming soon" description="Your bookings, quotations, and payment history land with the booking-flow build." />}
        />
        <Route
          path="/account/bookings/:id"
          element={<ComingSoonPage eyebrow="Account" title="Booking detail coming soon" description="Quotation, timeline, and balance payment land with the booking-flow build." />}
        />
        <Route
          path="/account/orders"
          element={<ComingSoonPage eyebrow="Account" title="My Orders coming soon" description="Your shop orders and tracking land with the shop build." />}
        />
        <Route
          path="/account/orders/:id"
          element={<ComingSoonPage eyebrow="Account" title="Order detail coming soon" description="Order items and status timeline land with the shop build." />}
        />
      </Route>

      <Route path="/checkout" element={<ComingSoonPage eyebrow="Checkout" title="Checkout coming soon" description="Checkout and Razorpay payment land with the shop build." />} />
      <Route path="/checkout/success" element={<ComingSoonPage eyebrow="Checkout" title="Payment success coming soon" description="" />} />
      <Route path="/checkout/failed" element={<ComingSoonPage eyebrow="Checkout" title="Payment failure coming soon" description="" />} />

      <Route
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminOverviewPage />} />
        {[
          ["/admin/bookings", "Bookings"],
          ["/admin/services", "Services"],
          ["/admin/portfolio", "Portfolio"],
          ["/admin/categories", "Categories"],
          ["/admin/products", "Products"],
          ["/admin/orders", "Orders"],
          ["/admin/customers", "Customers"],
          ["/admin/team", "Team"],
        ].map(([path, label]) => (
          <Route
            key={path}
            path={path}
            element={<ComingSoonPage eyebrow="Admin" title={`${label} management coming soon`} description="This module lands in an upcoming phase of the build." />}
          />
        ))}
      </Route>
    </Routes>
  );
}
