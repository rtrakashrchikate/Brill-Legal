import { Stagger, StaggerItem, Tilt } from "@/components/motion/primitives";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pillars } from "@/data/club";
import { cn } from "@/lib/utils";

const ACCENT_TEXT = {
  cranberry: "text-cranberry-600 dark:text-cranberry-400",
  gold: "text-gold-600 dark:text-gold-400",
  royal: "text-royal-700 dark:text-royal-300",
} as const;

const ACCENT_BG = {
  cranberry: "bg-cranberry-600/10",
  gold: "bg-gold-500/12",
  royal: "bg-royal-700/10",
} as const;

export function Pillars() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="What we run"
        title={
          <>
            Four avenues, one <span className="text-gradient">standard of care</span>.
          </>
        }
        description="Every project ends with a written handover note — what we fixed, what we deliberately did not, who to call, and when the next visit is due."
        className="max-w-3xl"
      />

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <StaggerItem key={pillar.title} className="h-full">
            <Tilt className="h-full" strength={6}>
              <GlassCard interactive padding="md" className="flex h-full flex-col gap-3">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl text-sm font-semibold",
                    ACCENT_BG[pillar.accent],
                    ACCENT_TEXT[pillar.accent],
                  )}
                  aria-hidden
                >
                  {pillar.title.slice(0, 1)}
                </span>
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="text-[0.86rem] leading-relaxed text-fg-muted">
                  {pillar.description}
                </p>
                <p
                  className={cn(
                    "mt-auto pt-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em]",
                    ACCENT_TEXT[pillar.accent],
                  )}
                >
                  {pillar.metric}
                </p>
              </GlassCard>
            </Tilt>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
