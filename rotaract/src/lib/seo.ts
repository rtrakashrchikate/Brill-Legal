import { site } from "@/config/site";
import type { Blog, ClubEvent, Member, NewsItem } from "@/types";

/**
 * Structured data and canonical helpers.
 *
 * Every builder returns a plain object that {@link JsonLd} serialises into a
 * single `application/ld+json` script. Only content that actually appears on
 * the page is described — schema that outruns the page is a rich-result
 * penalty waiting to happen.
 */

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}

/** Canonical entry for a page's `metadata.alternates`. */
export function canonical(path: string) {
  return { canonical: absoluteUrl(path) };
}

const publisher = {
  "@type": "NGO",
  name: site.name,
  url: site.url,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/icon.svg"),
  },
};

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": absoluteUrl("/#organisation"),
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    foundingDate: String(site.chartered),
    slogan: site.tagline,
    logo: absoluteUrl("/icon.svg"),
    email: site.email,
    telephone: site.whatsapp,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Deccan Gymkhana",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411004",
      addressCountry: "IN",
    },
    parentOrganization: {
      "@type": "NGO",
      name: "Rotary International",
      url: "https://www.rotary.org",
    },
    memberOf: {
      "@type": "Organization",
      name: `Rotary International District ${site.district.replace("RID ", "")}`,
    },
    sameAs: Object.values(site.socials),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-IN",
    publisher: { "@id": absoluteUrl("/#organisation") },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function articleSchema(blog: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: absoluteUrl(`/blogs/${blog.slug}/opengraph-image`),
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    inLanguage: "en-IN",
    keywords: blog.tags.join(", "),
    articleSection: blog.category,
    wordCount: blog.body.join(" ").split(/\s+/).length,
    author: {
      "@type": "Person",
      name: blog.authorName,
      jobTitle: blog.authorRole,
      affiliation: { "@id": absoluteUrl("/#organisation") },
    },
    publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blogs/${blog.slug}`),
    },
  };
}

export function eventSchema(event: ClubEvent) {
  const online = event.city.toLowerCase() === "online";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    image: absoluteUrl(`/events/${event.slug}/opengraph-image`),
    location: online
      ? { "@type": "VirtualLocation", url: event.registerUrl ?? site.url }
      : {
          "@type": "Place",
          name: event.venue,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.venue,
            addressLocality: event.city,
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
        },
    organizer: { "@id": absoluteUrl("/#organisation") },
    // Club projects are free to attend; stating it explicitly is what makes
    // the event eligible for a rich result.
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: event.registerUrl ?? absoluteUrl(`/events/${event.slug}`),
      validFrom: event.startsAt,
    },
    maximumAttendeeCapacity: event.seats,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/events/${event.slug}`),
    },
  };
}

export function newsSchema(item: NewsItem) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    image: absoluteUrl(`/news/${item.slug}/opengraph-image`),
    datePublished: item.publishedAt,
    dateModified: item.publishedAt,
    inLanguage: "en-IN",
    articleSection: item.impactArea,
    author: { "@type": "Organization", name: item.club },
    publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/news/${item.slug}`),
    },
  };
}

/** Collection pages describe their listing so crawlers see the set, not a page. */
export function itemListSchema(
  name: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: absoluteUrl(path),
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export function memberListSchema(members: Member[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Members & Board of Directors",
    url: absoluteUrl("/members"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: members.length,
      itemListElement: members.map((member, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: member.name,
          jobTitle: member.role,
          email: member.email,
          telephone: member.whatsapp,
          memberOf: { "@id": absoluteUrl("/#organisation") },
        },
      })),
    },
  };
}
