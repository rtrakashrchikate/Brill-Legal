import type { Metadata } from "next";

import { EventTimeline, type TimelineEvent } from "@/components/events/EventTimeline";
import { CtaBand } from "@/components/home/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, canonical, eventSchema } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { eventStatus, getEvents } from "@/lib/source/content";

export const metadata: Metadata = {
  title: "Club Events",
  description:
    "Upcoming initiatives and completed projects from the Rotaract Club of Pune Metro, on a live timeline with countdowns to every start.",
  alternates: canonical("/events"),
};

// Countdowns need a fresh reference point, so the page revalidates hourly.
export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getEvents();
  const withStatus: TimelineEvent[] = events.map((event) => ({
    ...event,
    status: eventStatus(event),
  }));

  const upcoming = withStatus.filter((event) => event.status !== "completed");

  return (
    <>
      {/* Each upcoming event is described individually — an Event rich result
          is per-event, not per-listing. */}
      <JsonLd
        schema={[
          ...upcoming.map((event) => eventSchema(event)),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Club events"
        title="Everything on the calendar, and everything already done."
        description="Upcoming initiatives run a live countdown to the start. Completed projects stay on the timeline with their outcomes attached — the archive is the point."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="cranberry">{upcoming.length} upcoming</Badge>
          <Badge tone="neutral">{withStatus.length - upcoming.length} completed</Badge>
          <Badge tone="gold">Open to non-members unless stated</Badge>
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
        <EventTimeline events={withStatus} />
      </section>

      <CtaBand />
    </>
  );
}
