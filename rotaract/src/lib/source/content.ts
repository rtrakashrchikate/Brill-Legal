import "server-only";

import membersSeed from "@/data/members.json";
import blogsSeed from "@/data/blogs.json";
import eventsSeed from "@/data/events.json";
import newsSeed from "@/data/news.json";
import { sbSelect } from "@/lib/backend/supabase";
import type { Blog, ClubEvent, EventStatus, Member, NewsItem } from "@/types";

/**
 * Read-side data access.
 *
 * Each accessor tries Supabase first and falls back to the in-repo seed data,
 * so the site renders identically with or without a backend.
 */

const members = membersSeed as Member[];
const blogs = blogsSeed as Blog[];
const events = eventsSeed as ClubEvent[];
const news = newsSeed as NewsItem[];

/* -------------------------------------------------------------------------- */
/* Members                                                                    */
/* -------------------------------------------------------------------------- */

export async function getMembers(): Promise<Member[]> {
  const remote = await sbSelect<Member>("members", "select=*&order=rank.asc");
  const rows = remote?.length ? remote : members;
  return [...rows].sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}

export async function getMember(slug: string): Promise<Member | undefined> {
  return (await getMembers()).find((m) => m.slug === slug);
}

export async function getMemberYears(): Promise<string[]> {
  const years = new Set((await getMembers()).map((m) => m.year));
  return [...years].sort().reverse();
}

/* -------------------------------------------------------------------------- */
/* Blogs                                                                      */
/* -------------------------------------------------------------------------- */

export async function getBlogs(): Promise<Blog[]> {
  const remote = await sbSelect<Blog>("blogs", "select=*&order=publishedAt.desc");
  const rows = remote?.length ? remote : blogs;
  return [...rows].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getBlog(slug: string): Promise<Blog | undefined> {
  return (await getBlogs()).find((b) => b.slug === slug);
}

export async function getBlogCategories(): Promise<string[]> {
  return [...new Set((await getBlogs()).map((b) => b.category))].sort();
}

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

export function eventStatus(event: ClubEvent, now = Date.now()): EventStatus {
  const start = new Date(event.startsAt).getTime();
  const end = new Date(event.endsAt).getTime();
  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "completed";
}

export async function getEvents(): Promise<ClubEvent[]> {
  const remote = await sbSelect<ClubEvent>("events", "select=*&order=startsAt.asc");
  const rows = remote?.length ? remote : events;
  return [...rows].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export async function getUpcomingEvents(): Promise<ClubEvent[]> {
  const all = await getEvents();
  return all.filter((e) => eventStatus(e) !== "completed");
}

export async function getPastEvents(): Promise<ClubEvent[]> {
  const all = await getEvents();
  return all.filter((e) => eventStatus(e) === "completed").reverse();
}

export async function getEvent(slug: string): Promise<ClubEvent | undefined> {
  return (await getEvents()).find((e) => e.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* District news                                                              */
/* -------------------------------------------------------------------------- */

export async function getNews(): Promise<NewsItem[]> {
  const remote = await sbSelect<NewsItem>("news", "select=*&order=publishedAt.desc");
  const rows = remote?.length ? remote : news;
  return [...rows].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getNewsItem(slug: string): Promise<NewsItem | undefined> {
  return (await getNews()).find((item) => item.slug === slug);
}
