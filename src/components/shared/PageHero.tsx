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
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  crumb?: { name: string; path: string }[];
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-navy-900 text-white">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-105 w-105 rounded-full bg-electric-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-52 left-[-5%] h-105 w-105 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/70 to-navy-900" />

      <Container className={cn("relative", compact ? "py-24 sm:py-28" : "py-28 sm:py-36")}>
        {crumb ? (
          <div className="mb-6">
            <Breadcrumb items={crumb} dark />
          </div>
        ) : null}
        <Reveal className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              <span className="h-px w-8 bg-cyan-400/60" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-navy-200 sm:text-lg">
              {description}
            </p>
          ) : null}
        </Reveal>
        {children ? <div className="relative mt-10">{children}</div> : null}
      </Container>
    </div>
  );
}
