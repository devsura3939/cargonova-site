import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Nordvia-style button — sharp corners, signal primary (ink text on orange),
 * hairline outline and quiet ghost variants. `rounded-full` is deliberately
 * not used; the product face is squared-off and technical.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] text-[14px] font-medium transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-signal text-ink-950 hover:bg-signal-400",
        secondary:
          "border border-white/15 text-fog-200 hover:border-white/35 hover:text-fog-50",
        outline:
          "border border-soft bg-surface text-ink hover:border-signal/60 hover:text-signal-600 dark:hover:text-signal-400",
        ghost:
          "text-ink hover:bg-surface-hover hover:text-strong",
        "ghost-light": "text-white/70 hover:bg-white/10 hover:text-white",
        dark: "bg-ink-900 text-fog-50 hover:bg-ink-850",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-[52px] px-7 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
