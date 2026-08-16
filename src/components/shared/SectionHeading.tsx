import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]",
            align === "center" && "justify-center",
            dark ? "text-cyan-400" : "text-electric-600",
          )}
        >
          <span className={cn("h-px w-8", dark ? "bg-cyan-400/60" : "bg-electric-500/60")} />
          {eyebrow}
          {align === "center" ? (
            <span className={cn("h-px w-8", dark ? "bg-cyan-400/60" : "bg-electric-500/60")} />
          ) : null}
        </p>
      ) : null}
      <Tag
        className={cn(
          "text-balance font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-white" : "text-strong",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-5 text-pretty text-base leading-relaxed sm:text-lg",
            dark ? "text-navy-200" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
