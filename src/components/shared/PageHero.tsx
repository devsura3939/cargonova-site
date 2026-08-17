import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/shared/Container";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  crumb,
  children,
  compact = false,
  index,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  crumb?: { name: string; path: string }[];
  children?: React.ReactNode;
  compact?: boolean;
  /** Mono index shown before the eyebrow, e.g. "01". */
  index?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-ink-950 text-fog-50">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-105 w-105 rounded-full bg-signal/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" />

      <Container className={cn("relative", compact ? "py-20 sm:py-24" : "py-24 sm:py-28")}>
        {crumb ? (
          <div className="mb-7">
            <Breadcrumb items={crumb} dark />
          </div>
        ) : null}
        <Reveal className="max-w-3xl">
          {eyebrow ? (
            <p className="label flex flex-wrap items-center gap-2.5 text-fog-500">
              {index ? <span className="text-signal">{index}</span> : null}
              <span>{eyebrow}</span>
            </p>
          ) : null}
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[56px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed text-fog-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </Reveal>
        {children ? <div className="relative mt-10">{children}</div> : null}
      </Container>
    </div>
  );
}
