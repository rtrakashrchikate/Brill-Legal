import Link from "next/link";

import { BlogCard } from "@/components/blogs/BlogCard";
import { Countdown } from "@/components/events/Countdown";
import { CtaBand } from "@/components/home/CtaBand";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { StatsBand } from "@/components/home/StatsBand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { CopyButton, WhatsAppIcon } from "@/components/ui/CopyButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBlogs, getNews, getUpcomingEvents } from "@/lib/source/content";
import { getRequests } from "@/lib/source/requests";
import { formatDate, formatDayDate, formatNumber, formatTime } from "@/lib/utils";

export default async function HomePage() {
  const [blogs, events, news, requests] = await Promise.all([
    getBlogs(),
    getUpcomingEvents(),
    getNews(),
    getRequests(),
  ]);

  const featured = blogs.filter((blog) => blog.featured).slice(0, 2);
  const nextEvent = events[0];
  const openRequests = requests.filter((request) => request.status === "open").slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <>
      <Hero />
      <StatsBand />
      <Pillars />

      {/* ---------------------------------------------------------------- */}
      {/* Next project + open asks                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {nextEvent && (
            <Reveal className="h-full">
              <GlassCard padding="lg" accent="gold" className="flex h-full flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="gold">Next up</Badge>
                  <Badge tone="royal">{nextEvent.avenue}</Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                    {nextEvent.title}
                  </h2>
                  <p className="text-[0.9rem] leading-relaxed text-fg-muted">
                    {nextEvent.summary}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-[0.8rem]">
                  <div>
                    <dt className="text-fg-muted">When</dt>
                    <dd className="font-medium">
                      {formatDayDate(nextEvent.startsAt)}, {formatTime(nextEvent.startsAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-fg-muted">Where</dt>
                    <dd className="font-medium">
                      {nextEvent.venue}, {nextEvent.city}
                    </dd>
                  </div>
                </dl>

                <Countdown startsAt={nextEvent.startsAt} />

                <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-2">
                  <ButtonLink href="/events" className="group">
                    See the full timeline
                    <ArrowRight className="group-hover:translate-x-1" />
                  </ButtonLink>
                  <CopyButton
                    value={nextEvent.contactWhatsapp}
                    label={nextEvent.contactName}
                    icon={<WhatsAppIcon />}
                  />
                </div>
              </GlassCard>
            </Reveal>
          )}

          <Reveal delay={0.1} className="h-full">
            <GlassCard padding="lg" accent="cranberry" className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold">Open on the hub</h2>
                <Link
                  href="/hub"
                  className="group/all inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-cranberry-600 dark:text-cranberry-400"
                >
                  All requests
                  <ArrowRight className="size-3.5 group-hover/all:translate-x-1" />
                </Link>
              </div>

              <ul className="flex flex-col divide-y divide-[var(--hairline)]">
                {openRequests.map((request) => (
                  <li key={request.id} className="flex flex-col gap-1.5 py-3.5 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[0.88rem] font-medium leading-snug">{request.title}</p>
                      {request.isVerified && <VerifiedBadge />}
                    </div>
                    <p className="text-[0.75rem] text-fg-muted">
                      {request.postedByClub} · {request.city} · needed by{" "}
                      {formatDate(request.needBy)}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-auto rounded-2xl border border-hairline bg-fg/[0.02] p-3 text-[0.76rem] leading-relaxed text-fg-muted">
                Reading and responding needs no account. Posting requires a verified Rotaractor
                profile, which is what the badge marks.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Writing                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading
          eyebrow="From the club"
          title={
            <>
              Playbooks, field notes and the{" "}
              <span className="text-gradient">numbers we&rsquo;d rather not publish</span>.
            </>
          }
          description="Written by the people who ran the projects, with the failure rates left in."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featured.map((blog, index) => (
            <Reveal key={blog.id} delay={index * 0.08}>
              <BlogCard blog={blog} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8 flex justify-center">
          <ButtonLink href="/blogs" variant="glass" size="lg" className="group">
            Read everything we&rsquo;ve published
            <ArrowRight className="group-hover:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* District news                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading
          eyebrow="Across the district"
          title="What other clubs pulled off this quarter"
          description="Aggregated from clubs across six districts — filterable by district and impact area on the news page."
        />

        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {latestNews.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <GlassCard interactive padding="md" className="flex h-full flex-col gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="cranberry">{item.district}</Badge>
                  <Badge tone="royal">{item.impactArea}</Badge>
                </div>
                <h3 className="text-[1rem] font-semibold leading-snug">{item.title}</h3>
                <p className="line-clamp-3 text-[0.84rem] leading-relaxed text-fg-muted">
                  {item.summary}
                </p>
                <p className="mt-auto pt-3 text-[0.76rem] font-semibold text-gold-700 dark:text-gold-300">
                  {item.impactMetric}
                  {item.beneficiaries > 0 && (
                    <span className="font-normal text-fg-muted">
                      {" "}
                      · {formatNumber(item.beneficiaries)} reached
                    </span>
                  )}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-8 flex justify-center">
          <ButtonLink href="/news" variant="glass" size="lg" className="group">
            Open the district feed
            <ArrowRight className="group-hover:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
