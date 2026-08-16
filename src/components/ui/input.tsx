import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-sm text-ink shadow-[0_1px_2px_rgb(11_31_58/0.04)] transition-colors duration-200 placeholder:text-slate/70 focus:border-electric-500 focus:outline-none focus:ring-4 focus:ring-electric-500/15 disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/15",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
