import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import {
  requestResetSchema,
  updatePasswordSchema,
  type RequestResetInput,
  type UpdatePasswordInput,
} from "@/features/auth/schemas";

/**
 * Handles both halves of the reset flow from one route:
 * - No recovery session yet -> request-a-reset-email form.
 * - Arrived via the emailed recovery link (Supabase sets a session with a
 *   "recovery" type) -> set-a-new-password form.
 */
export default function ResetPasswordPage() {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const isRecoveryMode = searchParams.get("type") === "recovery" || !!session;

  return isRecoveryMode ? <UpdatePasswordForm /> : <RequestResetForm />;
}

function RequestResetForm() {
  const { sendPasswordReset } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestResetInput>({ resolver: zodResolver(requestResetSchema) });

  const onSubmit = async (values: RequestResetInput) => {
    setFormError(null);
    const { error } = await sendPasswordReset(values.email);
    if (error) {
      setFormError(error);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell eyebrow="Password reset" title="Check your inbox">
        <p className="text-sm text-muted">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Reset your password"
      description="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-medium text-ink underline underline-offset-2">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}

function UpdatePasswordForm() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({ resolver: zodResolver(updatePasswordSchema) });

  const onSubmit = async (values: UpdatePasswordInput) => {
    setFormError(null);
    const { error } = await updatePassword(values.password);
    if (error) {
      setFormError(error);
      return;
    }
    navigate("/account", { replace: true });
  };

  return (
    <AuthShell eyebrow="Password reset" title="Set a new password">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </AuthShell>
  );
}
