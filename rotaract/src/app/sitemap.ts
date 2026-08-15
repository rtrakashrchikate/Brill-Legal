import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { eventStatus, getBlogs, getEvents, getNews } from "@/lib/source/content";

/**
 * XML sitemap.
 *
 * Only public, indexable routes appear — /login and /dashboard are excluded
 * here and marked `noindex` in their own metadata.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, events, news] = await Promise.all([getBlogs(), getEvents(), getNews()]);

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
      { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
      { url: absoluteUrl("/blogs"), changeFrequency: "weekly", priority: 0.8 },
      { url: absoluteUrl("/members"), changeFrequency: "monthly", priority: 0.7 },
      { url: absoluteUrl("/events"), changeFrequency: "daily", priority: 0.9 },
      { url: absoluteUrl("/news"), changeFrequency: "weekly", priority: 0.8 },
      // The hub changes whenever anyone posts, and is the page most worth
      // surfacing to someone searching for help.
      { url: absoluteUrl("/hub"), changeFrequency: "hourly", priority: 0.9 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: absoluteUrl(`/blogs/${blog.slug}`),
    lastModified: new Date(blog.publishedAt),
    changeFrequency: "yearly",
    priority: blog.featured ? 0.8 : 0.6,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: new Date(event.startsAt),
    changeFrequency: eventStatus(event) === "completed" ? "yearly" : "weekly",
    priority: eventStatus(event) === "completed" ? 0.4 : 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: absoluteUrl(`/news/${item.slug}`),
    lastModified: new Date(item.publishedAt),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogRoutes, ...eventRoutes, ...newsRoutes];
}
