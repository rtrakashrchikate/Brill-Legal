import { cache } from "react";
import {
  getAllArticles as localAll,
  type Article,
  type Faq,
} from "@/lib/content";
import { wpEnabled, wpFetch } from "@/lib/wp/client";
import { QUERY_ARTICLES } from "@/lib/wp/queries";
import { mapArticle, type WpArticleNode } from "@/lib/wp/map";

/**
 * Unified article source. Pulls from WordPress when WP_GRAPHQL_ENDPOINT is set,
 * otherwise serves the in-repo markdown library. All page code imports from
 * here so flipping the CMS on is a config change, not a code change.
 *
 * Cached per-render with React `cache()` so a page makes at most one WP call.
 */

function todayMs() {
  return Date.now();
}

export const allArticles = cache(async (): Promise<Article[]> => {
  if (wpEnabled) {
    const data = await wpFetch<{ posts: { nodes: WpArticleNode[] } }>(
      QUERY_ARTICLES,
      { tags: ["wp", "wp:articles"] },
    );
    if (data?.posts?.nodes) {
      return data.posts.nodes
        .map(mapArticle)
        .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
    }
    // fall through to local on failure
  }
  return localAll();
});

export async function publishedArticles(): Promise<Article[]> {
  const all = await allArticles();
  // WP nodes are already PUBLISH-filtered; local uses publishDate vs today.
  return all.filter((a) => a.published && new Date(a.publishDate).getTime() <= todayMs());
}

export async function articleBySlug(slug: string): Promise<Article | undefined> {
  return (await allArticles()).find((a) => a.slug === slug);
}

export async function articleSlugs(): Promise<string[]> {
  return (await allArticles()).map((a) => a.slug);
}

export async function articlesByPractice(practice: string): Promise<Article[]> {
  return (await allArticles()).filter((a) => a.practice === practice);
}

export async function pillars(): Promise<Article[]> {
  return (await allArticles()).filter((a) => a.type === "pillar");
}

export async function practicePillar(
  practice: string,
): Promise<Article | undefined> {
  return (await articlesByPractice(practice)).find((a) => a.type === "pillar");
}

export async function relatedTo(article: Article): Promise<Article[]> {
  const all = await allArticles();
  const slugs = article.related ?? [];
  const found = slugs
    .map((s) => all.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a));
  if (found.length >= 3) return found.slice(0, 3);
  const siblings = all.filter(
    (a) =>
      a.practice === article.practice &&
      a.slug !== article.slug &&
      !slugs.includes(a.slug),
  );
  return [...found, ...siblings].slice(0, 3);
}

export async function allFaqs(): Promise<
  { practice: string; article: Article; faq: Faq }[]
> {
  const rows: { practice: string; article: Article; faq: Faq }[] = [];
  for (const a of await publishedArticles()) {
    for (const faq of a.faqs ?? []) {
      rows.push({ practice: a.practice, article: a, faq });
    }
  }
  return rows;
}
