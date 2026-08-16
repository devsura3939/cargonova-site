import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-electric-500 text-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_8px_24px_-6px_rgb(22_119_255/0.55)] hover:bg-electric-400 hover:shadow-[0_2px_4px_rgb(0_0_0/0.2),0_12px_32px_-6px_rgb(22_119_255/0.7)]",
        secondary:
          "bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur hover:bg-white/15 hover:ring-white/30",
        outline:
          "border border-soft bg-surface text-ink hover:border-electric-400 hover:text-electric-600 hover:bg-electric-100/40 dark:hover:bg-electric-500/10",
        ghost:
          "text-ink hover:bg-surface-hover hover:text-strong",
        "ghost-light": "text-white/80 hover:bg-white/10 hover:text-white",
        dark: "bg-navy-850 text-white hover:bg-navy-700",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
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
