import type { Article, ArticleType, Faq } from "@/lib/content";

/**
 * Maps WordPress `vertical` taxonomy slugs to the front-end practice slugs
 * (which are also the public route segments). The firm can set vertical slugs
 * to match the front-end directly; this map also accepts the longer slugs from
 * the WordPress Setup Pack so either works.
 */
export const VERTICAL_TO_PRACTICE: Record<string, string> = {
  // front-end slugs (preferred — set these as the vertical slugs in WP)
  "dispute-resolution": "dispute-resolution",
  "white-collar": "white-collar",
  "real-estate": "real-estate",
  "private-client": "private-client",
  arbitration: "arbitration",
  corporate: "corporate",
  tribunal: "tribunal",
  // Setup-Pack slugs (mapped for compatibility)
  "dispute-resolution-litigation": "dispute-resolution",
  "white-collar-crime-investigations": "white-collar",
  "real-estate-construction": "real-estate",
  "private-client-family": "private-client",
  "arbitration-adr": "arbitration",
  "corporate-commercial": "corporate",
  "tribunal-regulatory": "tribunal",
};

type WpFaq = { question?: string | null; answer?: string | null } | null;

export type WpArticleNode = {
  title: string;
  slug: string;
  date: string;
  content?: string | null;
  excerpt?: string | null;
  author?: { node?: { name?: string | null; slug?: string | null } } | null;
  verticals?: { nodes?: { slug: string; name: string }[] } | null;
  articleFields?: {
    seoTitle?: string | null;
    metaDescription?: string | null;
    readTime?: number | null;
    isPillar?: boolean | null;
    faq?: WpFaq[] | null;
    relatedPractice?: { nodes?: { slug?: string }[] } | null;
    relatedArticles?: { nodes?: { slug?: string }[] } | null;
  } | null;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readingMinutes(html: string, readTime?: number | null): number {
  if (readTime && readTime > 0) return readTime;
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Convert a WPGraphQL Post node into the front-end Article shape. */
export function mapArticle(node: WpArticleNode): Article {
  const af = node.articleFields ?? {};
  const verticalSlug = node.verticals?.nodes?.[0]?.slug ?? "";
  const practice =
    af.relatedPractice?.nodes?.[0]?.slug ??
    VERTICAL_TO_PRACTICE[verticalSlug] ??
    verticalSlug;

  const type: ArticleType = af.isPillar ? "pillar" : "cluster";
  const html = node.content ?? "";
  const publishDate = (node.date ?? "").slice(0, 10);

  const faqs: Faq[] = (af.faq ?? [])
    .filter((f): f is { question?: string | null; answer?: string | null } =>
      Boolean(f && (f.question || f.answer)),
    )
    .map((f) => ({ q: f.question ?? "", a: f.answer ?? "" }));

  const related = (af.relatedArticles?.nodes ?? [])
    .map((n) => n.slug)
    .filter((s): s is string => Boolean(s));

  return {
    title: node.title,
    slug: node.slug,
    practice,
    type,
    keyword: af.seoTitle ?? node.title,
    description: af.metaDescription ?? stripHtml(node.excerpt ?? "").slice(0, 200),
    author: node.author?.node?.slug ?? "brill-legal",
    publishDate,
    related,
    faqs,
    body: html,
    bodyFormat: "html",
    readingMinutes: readingMinutes(html, af.readTime),
    published: true, // WP query already filters to PUBLISH
  };
}
