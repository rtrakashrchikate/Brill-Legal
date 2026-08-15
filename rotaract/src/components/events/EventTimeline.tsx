"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

import { Countdown } from "@/components/events/Countdown";
import { EngagementBar } from "@/components/engagement/EngagementBar";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { CopyButton, WhatsAppIcon } from "@/components/ui/CopyButton";
import { EmptyState, FilterChips } from "@/components/ui/Filters";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn, formatDayDate, formatTime } from "@/lib/utils";
import type { ClubEvent, EventStatus } from "@/types";

export interface TimelineEvent extends ClubEvent {
  status: EventStatus;
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

export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  const [filter, setFilter] = useState("upcoming");
  const [avenue, setAvenue] = useState("all");
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 65%", "end 45%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const avenues = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of events) counts.set(event.avenue, (counts.get(event.avenue) ?? 0) + 1);
    return [
      { value: "all", label: "All avenues" },
      ...[...counts.entries()].map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [events]);

  const filtered = useMemo(
    () =>
      events.filter((event) => {
        if (filter === "upcoming" && event.status === "completed") return false;
        if (filter === "past" && event.status !== "completed") return false;
        if (avenue !== "all" && event.avenue !== avenue) return false;
        return true;
      }),
    [events, filter, avenue],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips
          ariaLabel="Filter events by timing"
          layoutId="event-time-filter"
          options={[
            {
              value: "upcoming",
              label: "Upcoming",
              count: events.filter((e) => e.status !== "completed").length,
            },
            {
              value: "past",
              label: "Completed",
              count: events.filter((e) => e.status === "completed").length,
            },
            { value: "all", label: "Everything", count: events.length },
          ]}
          value={filter}
          onChange={setFilter}
        />
        <FilterChips
          ariaLabel="Filter events by avenue"
          layoutId="event-avenue-filter"
          options={avenues}
          value={avenue}
          onChange={setAvenue}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No events in this slice"
          description="Switch the avenue or look at completed projects to see what the club has already run."
        />
      ) : (
        <div ref={railRef} className="relative pl-8 sm:pl-12">
          {/* Rail */}
          <div
            className="absolute bottom-0 left-2.5 top-2 w-px bg-hairline sm:left-4"
            aria-hidden
          />
          <motion.div
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-2.5 top-2 w-px origin-top bg-gradient-to-b from-cranberry-600 via-gold-500 to-royal-700 sm:left-4"
            aria-hidden
          />

          <ol className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((event, index) => (
                <motion.li
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span
                    className={cn(
                      "absolute -left-[1.42rem] top-6 grid size-3.5 place-items-center rounded-full ring-4 ring-canvas sm:-left-[2.05rem]",
                      event.status === "completed"
                        ? "bg-fg-muted/50"
                        : "bg-cranberry-600 animate-[var(--animate-pulse-ring)]",
                    )}
                    aria-hidden
                  />
                  <EventRow event={event} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
      )}
    </div>
  );
}

function EventRow({ event }: { event: TimelineEvent }) {
  return (
    <GlassCard interactive padding="none" className="overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABEL[event.status]}</Badge>
          <Badge tone="royal">{event.avenue}</Badge>
          {typeof event.seats === "number" && (
            <Badge tone="neutral">{event.seats} places</Badge>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.78rem] text-fg-muted">
            <time dateTime={event.startsAt} className="font-medium text-fg">
              {formatDayDate(event.startsAt)}
            </time>
            <span>
              {formatTime(event.startsAt)} – {formatTime(event.endsAt)}
            </span>
            <span aria-hidden>·</span>
            <span>
              {event.venue}, {event.city}
            </span>
          </div>

          <h3 className="text-xl font-semibold sm:text-2xl">{event.title}</h3>
          <p className="max-w-2xl text-[0.88rem] leading-relaxed text-fg-muted">
            {event.description}
          </p>
        </div>

        {event.highlights.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {event.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-[0.83rem] text-fg-muted">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500"
                  aria-hidden
                />
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
          {event.status !== "completed" && (
            <Countdown startsAt={event.startsAt} compact className="mr-1" />
          )}

          {event.registerUrl && event.status !== "completed" && (
            <ButtonLink href={event.registerUrl} size="sm" className="group">
              Register
              <ArrowRight className="size-3.5 group-hover:translate-x-1" />
            </ButtonLink>
          )}

          <CopyButton
            value={event.contactWhatsapp}
            label={event.contactName}
            icon={<WhatsAppIcon />}
          />
        </div>

        <EngagementBar type="event" id={event.id} size="sm" />
      </div>
    </GlassCard>
  );
}
