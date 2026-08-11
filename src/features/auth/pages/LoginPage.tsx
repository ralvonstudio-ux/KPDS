import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";

export default function LoginPage() {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setFormError(null);
    const { error } = await signInWithPassword(values.email, values.password);
    if (error) {
      setFormError(error === "Invalid login credentials" ? "Incorrect email or password." : error);
      return;
    }
    const redirect = searchParams.get("redirect");
    navigate(redirect || "/account", { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your account"
      description="Access your bookings, quotations, and orders."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-ink underline underline-offset-2">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <Link to="/reset-password" className="mt-2 inline-block text-xs text-muted underline underline-offset-2">
            Forgot your password?
          </Link>
        </div>

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
