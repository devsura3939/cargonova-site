import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";

export function Section({
  variant = "light",
  className,
  containerClassName,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant?: "light" | "dark" | "mist";
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-24 lg:py-28",
        variant === "light" && "bg-white",
        variant === "mist" && "bg-mist",
        variant === "dark" && "bg-navy-900 text-white",
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{props.children}</Container>
    </section>
  );
}
