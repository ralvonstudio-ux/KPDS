import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { signupSchema, type SignupInput } from "@/features/auth/schemas";

export default function SignupPage() {
  const { signUpWithPassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupInput) => {
    setFormError(null);
    const { error } = await signUpWithPassword(values.email, values.password, values.fullName, values.phone);
    if (error) {
      setFormError(error);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthShell eyebrow="Almost there" title="Check your inbox">
        <p className="text-sm text-muted">
          We've created your account. If email confirmation is enabled for this project, confirm
          your address from the email we just sent, then log in.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate("/login")}>
          Go to login
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Create an account"
      title="Join Khatu Pixel"
      description="Book events, track quotations, and shop custom gifts from one place."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline underline-offset-2">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input label="Full name" required error={errors.fullName?.message} {...register("fullName")} />
        <Input
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          required
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
