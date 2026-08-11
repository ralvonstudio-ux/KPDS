import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});
type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  // General enquiries only — event bookings go through /book-your-event so
  // they land in the structured bookings table, not a plain message.
  const onSubmit = async (_values: ContactInput) => {
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
    reset();
  };

  return (
    <div className="section-space content-wrap">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        description="Have a question before booking, or a gifting enquiry? Send us a note."
      />

      <div className="mx-auto mt-16 max-w-lg">
        {submitted ? (
          <div className="rounded-card border border-line bg-surface p-8 text-center shadow-clay">
            <p className="text-display-sm text-ink">Message sent</p>
            <p className="mt-2 text-sm text-muted">We'll get back to you within 1–2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <Input label="Name" required error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
            <Input label="Phone (optional)" type="tel" error={errors.phone?.message} {...register("phone")} />
            <Textarea label="Message" required error={errors.message?.message} {...register("message")} />
            <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
