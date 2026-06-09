import type { Practice } from "@/data/practices";
import type { LocationPage } from "@/data/locations";
import type { Person } from "@/data/people";
import type { GlossaryTerm } from "@/data/glossary";
import type { Resource } from "@/data/resources";
import type { NewsItem } from "@/data/news";
import { VERTICAL_TO_PRACTICE } from "@/lib/wp/map";

export function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split a textarea value (newlines or commas) into a clean string array. */
function splitLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstRelatedSlug(rel?: { nodes?: { slug?: string }[] } | null): string {
  return rel?.nodes?.[0]?.slug ?? "";
}

function relatedSlugs(rel?: { nodes?: { slug?: string }[] } | null): string[] {
  return (rel?.nodes ?? []).map((n) => n.slug).filter((s): s is string => !!s);
}

function practiceFromVertical(
  verticals?: { nodes?: { slug: string }[] } | null,
): string {
  const slug = verticals?.nodes?.[0]?.slug ?? "";
  return VERTICAL_TO_PRACTICE[slug] ?? slug;
}

/* ----------------------------- Practice ----------------------------- */

export type WpPractice = {
  title: string;
  slug: string;
  verticals?: { nodes?: { slug: string }[] } | null;
  practiceFields?: {
    shortLabel?: string | null;
    heroIntro?: string | null;
    overview?: string | null;
    summary?: string | null;
    matterType?: string | null;
    orderNo?: number | null;
    capabilities?: { item?: string | null }[] | null;
  } | null;
};

export function mapPractice(node: WpPractice): Practice & { order: number } {
  const f = node.practiceFields ?? {};
  const summary = stripHtml(f.summary) || stripHtml(f.heroIntro);
  return {
    slug: node.slug,
    name: node.title,
    short: f.shortLabel || node.title,
    summary,
    intro: stripHtml(f.overview) || stripHtml(f.heroIntro) || summary,
    matterType: f.matterType || node.title,
    capabilities: (f.capabilities ?? [])
      .map((c) => c.item ?? "")
      .filter(Boolean),
    order: f.orderNo ?? 99,
  };
}

/* ----------------------------- Person ------------------------------- */

export type WpPerson = {
  title: string;
  slug: string;
  personFields?: {
    roleTitle?: string | null;
    bio?: string | null;
    practiceFocus?: string | null;
    education?: string | null;
    enrolment?: string | null;
    displayOrder?: number | null;
    linkedinUrl?: string | null;
    practices?: { nodes?: { slug?: string }[] } | null;
  } | null;
};

export function mapPerson(node: WpPerson): Person & { order: number } {
  const f = node.personFields ?? {};
  return {
    slug: node.slug,
    name: node.title,
    title: f.roleTitle ?? "",
    practices: relatedSlugs(f.practices),
    focus: splitLines(f.practiceFocus),
    education: splitLines(f.education),
    enrolment: f.enrolment ?? "",
    bio: stripHtml(f.bio),
    order: f.displayOrder ?? 99,
  };
}

/* ---------------------------- Location ------------------------------ */

export type WpLocation = {
  title: string;
  slug: string;
  cities?: { nodes?: { slug: string; name: string }[] } | null;
  verticals?: { nodes?: { slug: string }[] } | null;
  locationFields?: {
    serviceLabel?: string | null;
    cityLabel?: string | null;
    localIntro?: string | null;
    localCourts?: string | null;
    seoTitle?: string | null;
    metaDescription?: string | null;
    relatedPractice?: { nodes?: { slug?: string }[] } | null;
    relatedArticles?: { nodes?: { slug?: string }[] } | null;
    faq?: ({ question?: string | null; answer?: string | null } | null)[] | null;
  } | null;
};

export function mapLocation(node: WpLocation): LocationPage {
  const f = node.locationFields ?? {};
  const service = f.serviceLabel || node.title;
  const city = (f.cityLabel || node.cities?.nodes?.[0]?.name || "Pune") as
    | "Pune"
    | "Mumbai";
  return {
    slug: node.slug,
    service,
    city,
    practice: firstRelatedSlug(f.relatedPractice) || practiceFromVertical(node.verticals),
    articles: relatedSlugs(f.relatedArticles),
    title: f.seoTitle || `${service} Lawyer in ${city} | Brill Legal`,
    metaDescription: f.metaDescription ?? "",
    localContext: stripHtml(f.localIntro),
    courts: splitLines(f.localCourts),
    faqs: (f.faq ?? [])
      .filter((x): x is { question?: string | null; answer?: string | null } =>
        Boolean(x && (x.question || x.answer)),
      )
      .map((x) => ({ q: x.question ?? "", a: x.answer ?? "" })),
  };
}

/* ---------------------------- Glossary ------------------------------ */

export type WpGlossary = {
  title: string;
  slug: string;
  glossaryFields?: {
    definition?: string | null;
    relatedPractice?: { nodes?: { slug?: string }[] } | null;
    relatedArticle?: { nodes?: { slug?: string }[] } | null;
  } | null;
};

export function mapGlossary(node: WpGlossary): GlossaryTerm {
  const f = node.glossaryFields ?? {};
  return {
    term: node.title,
    slug: node.slug,
    definition: stripHtml(f.definition),
    practice: firstRelatedSlug(f.relatedPractice) || undefined,
    article: firstRelatedSlug(f.relatedArticle) || undefined,
  };
}

/* ---------------------------- Resource ------------------------------ */

export type WpResource = {
  title: string;
  slug: string;
  resourceFields?: {
    summary?: string | null;
    gateEmail?: boolean | null;
    items?: { item?: string | null }[] | null;
    relatedPractice?: { nodes?: { slug?: string }[] } | null;
    relatedArticle?: { nodes?: { slug?: string }[] } | null;
  } | null;
};

export function mapResource(node: WpResource): Resource {
  const f = node.resourceFields ?? {};
  return {
    slug: node.slug,
    title: node.title,
    description: stripHtml(f.summary),
    practice: firstRelatedSlug(f.relatedPractice),
    items: (f.items ?? []).map((i) => i.item ?? "").filter(Boolean),
    relatedArticle: firstRelatedSlug(f.relatedArticle) || undefined,
  };
}

/* ------------------------------ News -------------------------------- */

export type WpNews = {
  title: string;
  slug: string;
  content?: string | null;
  newsFields?: {
    summary?: string | null;
    date?: string | null;
    category?: string | null;
  } | null;
};

export function mapNews(node: WpNews): NewsItem {
  const f = node.newsFields ?? {};
  const category =
    f.category === "Legal update" ? "Legal update" : "Firm update";
  return {
    slug: node.slug,
    title: node.title,
    date: f.date ?? "",
    summary: stripHtml(f.summary),
    body: stripHtml(node.content),
    category,
  };
}

/* -------------------------- Site Settings --------------------------- */

export type WpSiteSettings = {
  siteSettings?: {
    siteSettingsFields?: {
      firmName?: string | null;
      strapline?: string | null;
      phone?: string | null;
      whatsappNumber?: string | null;
      email?: string | null;
      officeAddress?: string | null;
      gbpUrl?: string | null;
      linkedinUrl?: string | null;
      footerDisclaimer?: string | null;
      officeHours?: string | null;
    } | null;
  } | null;
};
