import { cache } from "react";
import { wpEnabled, wpFetch } from "@/lib/wp/client";
import {
  QUERY_PRACTICES,
  QUERY_PEOPLE,
  QUERY_LOCATIONS,
  QUERY_GLOSSARY,
  QUERY_RESOURCES,
  QUERY_NEWS,
} from "@/lib/wp/queries";
import {
  mapPractice,
  mapPerson,
  mapLocation,
  mapGlossary,
  mapResource,
  mapNews,
  type WpPractice,
  type WpPerson,
  type WpLocation,
  type WpGlossary,
  type WpResource,
  type WpNews,
} from "@/lib/wp/mappers";

import { practices as localPractices, type Practice } from "@/data/practices";
import {
  people as localPeople,
  authorOf as localAuthorOf,
  type Person,
} from "@/data/people";
import { locations as localLocations, type LocationPage } from "@/data/locations";
import { glossary as localGlossary, type GlossaryTerm } from "@/data/glossary";
import { resources as localResources, type Resource } from "@/data/resources";
import { news as localNews, type NewsItem } from "@/data/news";

/* ----------------------------- Practices ---------------------------- */

export const allPractices = cache(async (): Promise<Practice[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ practices: { nodes: WpPractice[] } }>(
      QUERY_PRACTICES,
      { tags: ["wp", "wp:practices"] },
    );
    if (data?.practices?.nodes?.length) {
      return data.practices.nodes
        .map(mapPractice)
        .sort((a, b) => a.order - b.order);
    }
  }
  return localPractices;
});

export async function practiceBySlug(slug: string): Promise<Practice | undefined> {
  return (await allPractices()).find((p) => p.slug === slug);
}

/* ------------------------------ People ------------------------------ */

export const allPeople = cache(async (): Promise<Person[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ people: { nodes: WpPerson[] } }>(QUERY_PEOPLE, {
      tags: ["wp", "wp:people"],
    });
    if (data?.people?.nodes?.length) {
      return data.people.nodes.map(mapPerson).sort((a, b) => a.order - b.order);
    }
  }
  return localPeople.filter((p) => p.slug !== "brill-legal");
});

export async function personBySlug(slug: string): Promise<Person | undefined> {
  return (await allPeople()).find((p) => p.slug === slug);
}

/** Resolve an article byline; falls back to the local editorial profile. */
export async function authorBySlug(slug: string): Promise<Person> {
  const wp = await personBySlug(slug);
  return wp ?? localAuthorOf(slug);
}

/* ----------------------------- Locations ---------------------------- */

export const allLocations = cache(async (): Promise<LocationPage[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ locations: { nodes: WpLocation[] } }>(
      QUERY_LOCATIONS,
      { tags: ["wp", "wp:locations"] },
    );
    if (data?.locations?.nodes?.length) {
      return data.locations.nodes.map(mapLocation);
    }
  }
  return localLocations;
});

export async function locationBySlug(
  slug: string,
): Promise<LocationPage | undefined> {
  return (await allLocations()).find((l) => l.slug === slug);
}

/* ----------------------------- Glossary ----------------------------- */

export const allGlossary = cache(async (): Promise<GlossaryTerm[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ glossaryTerms: { nodes: WpGlossary[] } }>(
      QUERY_GLOSSARY,
      { tags: ["wp", "wp:glossary"] },
    );
    if (data?.glossaryTerms?.nodes?.length) {
      return data.glossaryTerms.nodes.map(mapGlossary);
    }
  }
  return localGlossary;
});

export async function glossaryBySlug(
  slug: string,
): Promise<GlossaryTerm | undefined> {
  return (await allGlossary()).find((g) => g.slug === slug);
}

/* ----------------------------- Resources ---------------------------- */

export const allResources = cache(async (): Promise<Resource[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ resources: { nodes: WpResource[] } }>(
      QUERY_RESOURCES,
      { tags: ["wp", "wp:resources"] },
    );
    if (data?.resources?.nodes?.length) {
      return data.resources.nodes.map(mapResource);
    }
  }
  return localResources;
});

export async function resourceBySlug(
  slug: string,
): Promise<Resource | undefined> {
  return (await allResources()).find((r) => r.slug === slug);
}

/* ------------------------------- News ------------------------------- */

export const allNews = cache(async (): Promise<NewsItem[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ newsItems: { nodes: WpNews[] } }>(QUERY_NEWS, {
      tags: ["wp", "wp:news"],
    });
    if (data?.newsItems?.nodes?.length) {
      return data.newsItems.nodes.map(mapNews);
    }
  }
  return localNews;
});

export async function newsBySlug(slug: string): Promise<NewsItem | undefined> {
  return (await allNews()).find((n) => n.slug === slug);
}
