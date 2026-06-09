import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { practices } from "@/data/practices";
import { locations } from "@/data/locations";
import { glossary } from "@/data/glossary";
import { resources } from "@/data/resources";
import { people } from "@/data/people";
import { news } from "@/data/news";
import { publishedArticles } from "@/lib/source/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();
  const url = (path: string) => `${base}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/practices"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/people"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/resources"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/glossary"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/faqs"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/news"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/sitemap"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const practicePages = practices.map((p) => ({
    url: url(`/practices/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const locationPages = locations.map((l) => ({
    url: url(`/${l.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articlePages = (await publishedArticles()).map((a) => ({
    url: url(`/insights/${a.slug}`),
    lastModified: new Date(a.publishDate),
    changeFrequency: "monthly" as const,
    priority: a.type === "pillar" ? 0.9 : 0.7,
  }));

  const glossaryPages = glossary.map((g) => ({
    url: url(`/glossary/${g.slug}`),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  const resourcePages = resources.map((r) => ({
    url: url(`/resources/${r.slug}`),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const peoplePages = people
    .filter((p) => p.slug !== "brill-legal")
    .map((p) => ({
      url: url(`/people/${p.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  const newsPages = news.map((n) => ({
    url: url(`/news/${n.slug}`),
    lastModified: new Date(n.date),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...practicePages,
    ...locationPages,
    ...articlePages,
    ...glossaryPages,
    ...resourcePages,
    ...peoplePages,
    ...newsPages,
  ];
}
