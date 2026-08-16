import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex min-h-28 w-full rounded-xl border border-soft bg-surface px-3.5 py-2.5 text-sm text-ink shadow-[0_1px_2px_rgb(11_31_58/0.04)] transition-colors duration-200 placeholder:text-muted focus:border-electric-500 focus:outline-none focus:ring-4 focus:ring-electric-500/15 disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/15",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
