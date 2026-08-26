import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useServices } from "@/features/services/api";
import { createBooking, type Booking } from "@/features/booking/api";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/features/payments/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { bookingSchema, type BookingInput } from "@/features/booking/schemas";
import { DEFAULT_ADVANCE_PAISE, EVENT_TYPES } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { fadeUp } from "@/lib/motion";
import { usePageMeta } from "@/lib/usePageMeta";

type FlowStatus = "form" | "submitting" | "paying" | "payment_pending" | "success";

export default function BookEventPage() {
  usePageMeta("Book Your Event", "Tell us about your event and we'll put together a quote built around you.");
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const { data: services } = useServices();
  const [status, setStatus] = useState<FlowStatus>("form");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const preselectedServiceId = useMemo(() => {
    const slug = searchParams.get("service");
    if (!slug || !services) return "";
    return services.find((s) => s.slug === slug)?.id ?? "";
  }, [searchParams, services]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: profile?.full_name ?? "",
      mobile: profile?.phone ?? "",
      email: user?.email ?? "",
    },
  });

  useEffect(() => {
    if (profile?.full_name) setValue("fullName", profile.full_name);
    if (profile?.phone) setValue("mobile", profile.phone);
    if (user?.email) setValue("email", user.email);
  }, [profile, user, setValue]);

  useEffect(() => {
    if (preselectedServiceId) setValue("serviceId", preselectedServiceId);
  }, [preselectedServiceId, setValue]);

  const startPayment = async (targetBooking: Booking) => {
    setStatus("paying");
    setPaymentError(null);
    try {
      const order = await createRazorpayOrder({ purpose: "booking_advance", bookingId: targetBooking.id });
      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Khatu Pixel Digital Studio",
        description: `Booking advance — ${targetBooking.booking_reference}`,
        prefill: {
          name: targetBooking.full_name,
          email: targetBooking.email,
          contact: targetBooking.mobile,
        },
        theme: { color: "#C59D5F" },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(response);
            setStatus("success");
          } catch (err) {
            setPaymentError(err instanceof Error ? err.message : "Payment could not be verified.");
            setStatus("payment_pending");
          }
        },
        modal: {
          ondismiss: () => setStatus("payment_pending"),
        },
      });
    } catch (err) {
      setPaymentError(
        err instanceof Error
          ? err.message
          : "We couldn't start the payment. Your booking was still saved — try again below.",
      );
      setStatus("payment_pending");
    }
  };

  const onSubmit = async (values: BookingInput) => {
    if (!user) return;
    setStatus("submitting");
    try {
      const created = await createBooking(user.id, values);
      setBooking(created);
      await startPayment(created);
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("form");
    }
  };

  if (status === "success" && booking) {
    return <SuccessState booking={booking} />;
  }

  return (
    <div className="page-space content-wrap">
      <PageHeader
        eyebrow="Reserve your date"
        title="Book Your Event"
        description="Tell us about your event and pay a small advance to hold your date — we'll follow up with a tailored quote."
      />

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-[2fr_1fr]">
        <motion.form
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5 rounded-card-lg border border-line bg-surface p-6 shadow-clay md:p-8"
        >
          {services && services.length > 0 && (
            <Select label="Service (optional)" defaultValue={preselectedServiceId} {...register("serviceId")}>
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Select>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Full name" required error={errors.fullName?.message} {...register("fullName")} />
            <Input label="Mobile number" type="tel" required error={errors.mobile?.message} {...register("mobile")} />
          </div>

          <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select label="Event type" required error={errors.eventType?.message} {...register("eventType")}>
              <option value="">Select event type</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Input
              label="Preferred event date"
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              error={errors.preferredEventDate?.message}
              {...register("preferredEventDate")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Event location / venue"
              required
              error={errors.eventLocation?.message}
              {...register("eventLocation")}
            />
            <Input label="City" required error={errors.city?.message} {...register("city")} />
          </div>

          <Textarea
            label="Anything else we should know? (optional)"
            error={errors.notes?.message}
            {...register("notes")}
          />

          {paymentError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {paymentError}
            </p>
          )}

          <Button type="submit" variant="gold" disabled={isSubmitting || status === "submitting" || status === "paying"} className="mt-2 w-full">
            {status === "submitting"
              ? "Saving your booking…"
              : status === "paying"
                ? "Opening secure payment…"
                : `Pay ${formatINR(DEFAULT_ADVANCE_PAISE)} Advance & Reserve`}
          </Button>

          {status === "payment_pending" && booking && (
            <div className="rounded-lg border border-gold-soft bg-gold-soft/10 px-4 py-3 text-sm text-espresso">
              <p>
                Your booking <strong>{booking.booking_reference}</strong> was saved. You can try the payment again
                whenever you're ready.
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => startPayment(booking)}>
                Try payment again
              </Button>
            </div>
          )}
        </motion.form>

        <aside className="h-fit rounded-card-lg border border-line bg-surface p-6 shadow-clay lg:sticky lg:top-28">
          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted">How it works</p>
          <ol className="mt-4 space-y-4 text-sm text-ink/90">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso text-xs font-medium text-white">1</span>
              Tell us about your event and preferred date.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso text-xs font-medium text-white">2</span>
              Pay a {formatINR(DEFAULT_ADVANCE_PAISE)} advance to hold your date.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso text-xs font-medium text-white">3</span>
              We review your request and send a detailed quote to your dashboard.
            </li>
          </ol>
          <p className="mt-6 text-xs text-muted">
            Payments are processed securely by Razorpay. The advance is adjusted against your final quote.
          </p>
        </aside>
      </div>
    </div>
  );
}

function SuccessState({ booking }: { booking: Booking }) {
  return (
    <div className="page-space content-wrap flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-lg rounded-card-lg border border-line bg-surface p-10 text-center shadow-clay"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft/40 text-gold-deep">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-display-sm text-ink">Your date is on hold</h1>
        <p className="mt-2 text-sm text-muted">
          Booking reference <strong className="text-ink">{booking.booking_reference}</strong>
        </p>
        <p className="mt-4 text-sm text-muted">
          We've received your advance payment and your event request. Our team will review your details and send a
          tailored quote to your account shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink to="/account" variant="gold">
            Go to my account
          </ButtonLink>
          <ButtonLink to="/portfolio" variant="outline">
            Explore our work
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
