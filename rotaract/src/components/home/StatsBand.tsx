import { CountUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import { GlassCard } from "@/components/ui/GlassCard";
import { stats } from "@/data/club";

export function StatsBand() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6" aria-label="Club impact">
      <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <GlassCard padding="md" className="h-full" accent="cranberry">
              <p className="font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem]">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix ?? ""}
                  suffix={stat.suffix ?? ""}
                  className="text-gradient"
                />
              </p>
              <p className="mt-2 text-sm font-medium">{stat.label}</p>
              <p className="mt-0.5 text-[0.78rem] text-fg-muted">{stat.caption}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
