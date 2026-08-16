import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-electric-100 text-electric-600 dark:bg-electric-500/15 dark:text-electric-400",
        light: "bg-white/10 text-white ring-1 ring-inset ring-white/20",
        cyan: "bg-cyan-100 text-navy-800 dark:bg-cyan-500/15 dark:text-cyan-300",
        orange: "bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400",
        outline: "border border-navy-200 text-navy-700 dark:border-white/15 dark:text-navy-200",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
