import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements, history, mission, stats, values, vision } from "@/data/club";
import { site } from "@/config/site";
import { breadcrumbSchema, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "History, mission and how the Rotaract Club of Pune Metro actually works — including the standards we hold ourselves to and the numbers we publish.",
  alternates: canonical("/about"),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        eyebrow="About the club"
        title="Twenty-two years of doing the unglamorous half of the work."
        description="Chartered in 2004 under RID 3131. Most of what follows is process rather than achievement, because the process is the part that survived a change of board."
      />

      {/* Mission & vision */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard padding="lg" accent="cranberry" className="h-full">
              <Badge tone="cranberry">Mission</Badge>
              <p className="mt-4 font-display text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">
                {mission}
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard padding="lg" accent="royal" className="h-full">
              <Badge tone="royal">Vision</Badge>
              <p className="mt-4 font-display text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">
                {vision}
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading
          eyebrow="Where we stand"
          title="The audited version"
          description="Published every quarter, project by project, whether or not the quarter went well."
        />

        <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <GlassCard padding="md" className="h-full">
                <p className="font-display text-3xl font-semibold sm:text-4xl">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix ?? ""}
                    className="text-gradient"
                  />
                </p>
                <p className="mt-2 text-sm font-medium">{stat.label}</p>
                <p className="mt-0.5 text-[0.76rem] text-fg-muted">{stat.caption}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Values */}
      <section id="values" className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading
          eyebrow="How we work"
          title="Four rules that decide everything else"
          description="They are unglamorous on purpose. Each one exists because we got the opposite wrong first."
        />

        <Stagger className="mt-10 grid gap-4 md:grid-cols-2">
          {values.map((value, index) => (
            <StaggerItem key={value.title} className="h-full">
              <GlassCard interactive padding="lg" className="flex h-full gap-5">
                <span
                  className="font-display text-3xl font-semibold text-cranberry-600/25 dark:text-cranberry-400/25"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="text-[0.88rem] leading-relaxed text-fg-muted">{value.body}</p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* History timeline */}
      <section id="history" className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading
          eyebrow="History"
          title="From twenty-two founders to a district platform"
          description="Chartered in 2004 with a first-year budget of ₹40,000."
        />

        <ol className="relative mt-12 flex flex-col gap-6 pl-8 sm:pl-12">
          <span
            className="absolute bottom-2 left-2.5 top-2 w-px bg-gradient-to-b from-cranberry-600 via-gold-500 to-royal-700 sm:left-4"
            aria-hidden
          />

          {history.map((entry, index) => (
            <Reveal as="li" key={entry.year} delay={index * 0.04} className="relative">
              <span
                className="absolute -left-[1.42rem] top-6 size-3 rounded-full bg-cranberry-600 ring-4 ring-canvas sm:-left-[2.08rem]"
                aria-hidden
              />
              <GlassCard interactive padding="md" className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-xl font-semibold text-gradient">
                    {entry.year}
                  </span>
                  {entry.badge && <Badge tone="gold">{entry.badge}</Badge>}
                </div>
                <h3 className="text-[1.05rem] font-semibold">{entry.title}</h3>
                <p className="text-[0.87rem] leading-relaxed text-fg-muted">{entry.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Achievements */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6">
        <SectionHeading
          eyebrow="Recognition"
          title="District citations"
          description={`Awarded across ${site.district}. Listed for completeness — the handover notes matter more.`}
        />

        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <StaggerItem key={achievement.label}>
              <GlassCard padding="md" className="flex items-center justify-between gap-4">
                <span className="text-[0.9rem] font-medium">{achievement.label}</span>
                <span className="shrink-0 text-[0.74rem] text-fg-muted">{achievement.year}</span>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand />
    </>
  );
}
