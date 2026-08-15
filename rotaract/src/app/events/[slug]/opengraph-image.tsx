import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { getEvent, getEvents } from "@/lib/source/content";
import { formatDayDate, formatTime } from "@/lib/utils";

export const alt = "Rotaract Club of Pune Metro event";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  return ogImage({
    eyebrow: event?.avenue ?? "Club event",
    title: event?.title ?? "Club event",
    meta: event
      ? `${formatDayDate(event.startsAt)} · ${formatTime(event.startsAt)} · ${event.venue}`
      : undefined,
  });
}
