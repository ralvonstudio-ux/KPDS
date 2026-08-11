import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-ink " +
  "placeholder:text-muted transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:border-gold focus-visible:shadow-focus " +
  "disabled:bg-black/[0.03] disabled:text-muted";

interface WrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, hint, required, children }: WrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-gold-deep"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(fieldClasses, error && "border-red-400", className)}
        {...props}
      />
    </FieldWrapper>
  ),
);
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(fieldClasses, "min-h-28 resize-y", error && "border-red-400", className)}
        {...props}
      />
    </FieldWrapper>
  ),
);
Textarea.displayName = "Textarea";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className, required, children, ...props }, ref) => (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(fieldClasses, "appearance-none bg-no-repeat", error && "border-red-400", className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  ),
);
Select.displayName = "Select";
