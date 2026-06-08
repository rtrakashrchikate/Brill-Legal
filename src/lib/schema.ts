import { site } from "@/config/site";
import type { Article, Faq } from "@/lib/content";
import type { Person } from "@/data/people";

/**
 * JSON-LD builders. Every page renders the relevant subset via <JsonLd />.
 * Rich results = higher CTR; these are first-class, not afterthoughts.
 */

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema() {
  return {
    "@type": ["LegalService", "LocalBusiness"],
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
    foundingDate: String(site.practisingSince),
    areaServed: ["Pune", "Mumbai", "Maharashtra", "India"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressLine,
      addressLocality: site.contact.locality,
      addressRegion: site.contact.region,
      postalCode: site.contact.postalCode,
      addressCountry: site.contact.country,
    },
    sameAs: [site.social.linkedin],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/insights?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.url}`,
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(article: Article, authorUrl?: string) {
  return {
    "@type": article.type === "pillar" ? "Article" : "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    author: authorUrl
      ? { "@type": "Person", name: article.author, url: authorUrl }
      : { "@type": "Person", name: article.author },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: `${site.url}/insights/${article.slug}`,
    keywords: article.keyword,
  };
}

export function howToSchema(name: string, steps: { name: string; text: string }[]) {
  return {
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function personSchema(p: Person) {
  return {
    "@type": ["Person", "Attorney"],
    name: p.name,
    jobTitle: p.title,
    url: `${site.url}/people/${p.slug}`,
    worksFor: { "@id": ORG_ID },
    knowsAbout: p.focus,
    alumniOf: p.education,
  };
}

export function legalServiceLocationSchema(args: {
  name: string;
  description: string;
  city: string;
  url: string;
}) {
  return {
    "@type": "LegalService",
    name: args.name,
    description: args.description,
    url: `${site.url}${args.url}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: args.city },
    telephone: site.contact.phone,
  };
}

/** Wrap one or more schema objects into a single @graph document. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
