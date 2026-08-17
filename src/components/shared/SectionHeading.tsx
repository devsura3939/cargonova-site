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
  index,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center" | "split";
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
  /** Mono index shown before the eyebrow, e.g. "01". */
  index?: string;
  /** Right-aligned action (split layout only). */
  action?: React.ReactNode;
}) {
  const label = (
    <p
      className={cn(
        "label flex flex-wrap items-center gap-2.5",
        align === "center" && "justify-center",
      )}
    >
      {index ? <span className="text-signal">{index}</span> : null}
      <span className={dark ? "text-fog-500" : "text-muted"}>{eyebrow}</span>
    </p>
  );

  const heading = (
    <Tag
      className={cn(
        "text-balance font-display text-[28px] font-semibold leading-[1.06] tracking-[-0.025em] sm:text-4xl lg:text-[44px]",
        dark ? "text-fog-50" : "text-strong",
      )}
    >
      {title}
    </Tag>
  );

  const lead = description ? (
    <p
      className={cn(
        "mt-5 max-w-xl text-pretty text-[15.5px] leading-relaxed",
        dark ? "text-fog-500" : "text-muted",
      )}
    >
      {description}
    </p>
  ) : null;

  if (align === "split") {
    return (
      <Reveal className={cn("lg:flex lg:items-end lg:justify-between lg:gap-10", className)}>
        <div className="max-w-2xl">
          {eyebrow ? label : null}
          <div className="mt-5">{heading}</div>
          {lead}
        </div>
        {action ? <div className="mt-8 shrink-0 lg:mt-0">{action}</div> : null}
      </Reveal>
    );
  }

  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? label : null}
      <div className="mt-5">{heading}</div>
      {lead}
    </Reveal>
  );
}
