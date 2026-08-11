import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium " +
  "transition-[transform,background-color,color,box-shadow] duration-200 ease-editorial " +
  "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 " +
  "active:translate-y-px";

const variants = {
  primary: "bg-espresso text-white hover:bg-ink shadow-clay",
  gold: "bg-gold text-espresso hover:bg-gold-deep shadow-clay",
  outline: "border border-line-strong text-ink hover:border-espresso bg-transparent",
  ghost: "text-ink hover:bg-black/[0.04]",
};

const sizes = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-[3.25rem] px-8 text-base",
};

interface ButtonOwnProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

type ButtonLinkProps = ButtonOwnProps & LinkProps;

export function ButtonLink({ className, variant = "primary", size = "md", ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
