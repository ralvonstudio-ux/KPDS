import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const profileSchema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid mobile number")
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number"),
});
type ProfileInput = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type PasswordInput = z.infer<typeof passwordSchema>;

export default function AccountProfilePage() {
  const { user, profile, refreshProfile, updatePassword } = useAuth();

  return (
    <div>
      <PageHeader eyebrow="Your account" title="Profile" />

      <div className="mx-auto mt-10 flex max-w-lg flex-col gap-8">
        <ProfileForm defaultValues={{ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" }} userId={user?.id} onSaved={refreshProfile} email={user?.email} />
        <PasswordForm updatePassword={updatePassword} />
      </div>
    </div>
  );
}

function ProfileForm({
  defaultValues,
  userId,
  email,
  onSaved,
}: {
  defaultValues: ProfileInput;
  userId: string | undefined;
  email: string | undefined;
  onSaved: () => Promise<void>;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues });

  const onSubmit = async (values: ProfileInput) => {
    if (!userId) return;
    setStatus("saving");
    setFormError(null);
    const { error } = await supabase.from("profiles").update(values).eq("id", userId);
    if (error) {
      setFormError(error.message);
      setStatus("idle");
      return;
    }
    await onSaved();
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6">
      <p className="text-sm font-medium text-ink">Contact details</p>
      <Input label="Email" value={email ?? ""} disabled hint="Contact us to change your email address." />
      <Input label="Full name" required error={errors.full_name?.message} {...register("full_name")} />
      <Input label="Mobile number" type="tel" required error={errors.phone?.message} {...register("phone")} />
      {formError && <p className="text-sm text-red-700">{formError}</p>}
      <Button type="submit" disabled={status === "saving"} className="mt-1">
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordForm({ updatePassword }: { updatePassword: (p: string) => Promise<{ error: string | null }> }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordInput>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: PasswordInput) => {
    setStatus("saving");
    setFormError(null);
    const { error } = await updatePassword(values.password);
    if (error) {
      setFormError(error);
      setStatus("idle");
      return;
    }
    reset();
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6">
      <p className="text-sm font-medium text-ink">Change password</p>
      <Input label="New password" type="password" required hint="At least 8 characters." error={errors.password?.message} {...register("password")} />
      <Input label="Confirm new password" type="password" required error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      {formError && <p className="text-sm text-red-700">{formError}</p>}
      <Button type="submit" disabled={status === "saving"} className="mt-1">
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Update password"}
      </Button>
    </form>
  );
}
