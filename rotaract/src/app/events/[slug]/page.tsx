import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EngagementBar } from "@/components/engagement/EngagementBar";
import { Countdown } from "@/components/events/Countdown";
import { CtaBand } from "@/components/home/CtaBand";
import { Reveal } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { CopyButton, MailIcon, WhatsAppIcon } from "@/components/ui/CopyButton";
import { CoverArt } from "@/components/ui/CoverArt";
import { GlassCard } from "@/components/ui/GlassCard";
import { canonical, eventSchema } from "@/lib/seo";
import { eventStatus, getEvent, getEvents } from "@/lib/source/content";
import { formatDayDate, formatTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Status and countdown are time-relative, so a completed event stops claiming
// to be upcoming without waiting for a redeploy.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.summary,
    alternates: canonical(`/events/${event.slug}`),
    openGraph: {
      type: "article",
      title: event.title,
      description: event.summary,
    },
  };
}

const STATUS_TONE = {
  upcoming: "cranberry",
  ongoing: "success",
  completed: "neutral",
} as const;

const STATUS_LABEL = {
  upcoming: "Upcoming",
  ongoing: "Happening now",
  completed: "Completed",
} as const;

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const status = eventStatus(event);
  const others = (await getEvents())
    .filter((item) => item.id !== event.id && eventStatus(item) !== "completed")
    .slice(0, 3);

  return (
    <>
      <JsonLd schema={eventSchema(event)} />

      <article className="relative isolate">
        <Aurora variant="soft" />

        <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6">
          <Reveal y={12}>
            <Breadcrumbs
              trail={[
                { name: "Home", path: "/" },
                { name: "Events", path: "/events" },
                { name: event.title, path: `/events/${event.slug}` },
              ]}
            />
          </Reveal>

          <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
            <Badge tone="royal">{event.avenue}</Badge>
            {typeof event.seats === "number" && (
              <Badge tone="neutral">{event.seats} places</Badge>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[2.9rem]">
              {event.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-fg-muted">
              {event.summary}
            </p>
          </Reveal>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-5xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <CoverArt
              seed={event.id}
              className="h-48 w-full rounded-3xl sm:h-72"
              label={`Artwork for ${event.title}`}
            />
          </Reveal>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-6">
              <Reveal>
                <p className="text-[1.02rem] leading-[1.85] text-fg/90">{event.description}</p>
              </Reveal>

              {event.highlights.length > 0 && (
                <Reveal delay={0.08}>
                  <GlassCard padding="lg" accent="gold">
                    <h2 className="font-display text-lg font-semibold">
                      {status === "completed" ? "What happened" : "What to expect"}
                    </h2>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {event.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-fg-muted"
                        >
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500"
                            aria-hidden
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              )}

              <Reveal delay={0.14}>
                <div className="flex flex-col gap-3 border-t border-hairline pt-6">
                  <p className="text-[0.8rem] text-fg-muted">
                    Going, or wish you could? React below — no account needed.
                  </p>
                  <EngagementBar type="event" id={event.id} trackView />
                </div>
              </Reveal>
            </div>

            <aside className="flex flex-col gap-5">
              <Reveal delay={0.06}>
                <GlassCard padding="lg" accent="cranberry" className="flex flex-col gap-5">
                  {status !== "completed" && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-fg-muted">
                        Starts in
                      </span>
                      <Countdown startsAt={event.startsAt} />
                    </div>
                  )}

                  <dl className="flex flex-col gap-3 text-[0.84rem]">
                    <div>
                      <dt className="text-fg-muted">When</dt>
                      <dd className="font-medium">
                        <time dateTime={event.startsAt}>{formatDayDate(event.startsAt)}</time>
                        <br />
                        {formatTime(event.startsAt)} – {formatTime(event.endsAt)} IST
                      </dd>
                    </div>
                    <div>
                      <dt className="text-fg-muted">Where</dt>
                      <dd className="font-medium">
                        {event.venue}
                        <br />
                        {event.city}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-fg-muted">Organiser</dt>
                      <dd className="font-medium">{event.contactName}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-2.5 border-t border-hairline pt-4">
                    {event.registerUrl && status !== "completed" && (
                      <ButtonLink href={event.registerUrl} className="group w-full">
                        Register
                        <ArrowRight className="group-hover:translate-x-1" />
                      </ButtonLink>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <CopyButton
                        value={event.contactWhatsapp}
                        label={event.contactWhatsapp}
                        icon={<WhatsAppIcon />}
                      />
                      <CopyButton value="hello@racpunemetro.org" label="Email" icon={<MailIcon />} />
                    </div>
                  </div>
                </GlassCard>
              </Reveal>

              {others.length > 0 && (
                <Reveal delay={0.12}>
                  <GlassCard padding="lg" className="flex flex-col gap-3">
                    <h2 className="font-display text-base font-semibold">Also coming up</h2>
                    <ul className="flex flex-col divide-y divide-[var(--hairline)]">
                      {others.map((item) => (
                        <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                          <Link
                            href={`/events/${item.slug}`}
                            className="group/item flex flex-col gap-0.5"
                          >
                            <span className="text-[0.86rem] font-medium leading-snug transition-colors group-hover/item:text-cranberry-600 dark:group-hover/item:text-cranberry-400">
                              {item.title}
                            </span>
                            <span className="text-[0.72rem] text-fg-muted">
                              {formatDayDate(item.startsAt)} · {item.city}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              )}
            </aside>
          </div>
        </div>
      </article>

      <CtaBand />
    </>
  );
}
