import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Article content layer. Articles live as Markdown files with YAML frontmatter
 * under `content/articles/<practice>/<slug>.md`. They are read at build time
 * (server components only).
 *
 * Publishing cadence: each article carries a `publishDate`. Articles whose date
 * is in the future are "scheduled" — they are excluded from listings and marked
 * noindex, but their page still renders (so internal links never 404 and the
 * page can be index-requested on its publish day). This implements the
 * white-hat "publish on a calendar, don't bulk-dump" rule.
 */

export type Faq = { q: string; a: string };

export type HowToStep = { name: string; text: string };

export type ArticleType = "pillar" | "cluster";

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  practice: string;
  type: ArticleType;
  keyword: string;
  description: string;
  author: string;
  publishDate: string; // YYYY-MM-DD
  related?: string[];
  faqs?: Faq[];
  howto?: { name: string; steps: HowToStep[] };
};

export type Article = ArticleFrontmatter & {
  body: string;
  /** "markdown" for in-repo content, "html" for WordPress-rendered content. */
  bodyFormat: "markdown" | "html";
  readingMinutes: number;
  published: boolean;
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function today(): Date {
  // Deterministic "now" for the build; mirrors the firm's current date.
  return new Date();
}

let _cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (_cache) return _cache;
  const out: Article[] = [];
  if (!fs.existsSync(ARTICLES_DIR)) {
    _cache = out;
    return out;
  }
  const practiceDirs = fs
    .readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const dir of practiceDirs) {
    const dirPath = path.join(ARTICLES_DIR, dir.name);
    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dirPath, file), "utf8");
      const { data, content } = matter(raw);
      const fm = data as ArticleFrontmatter;
      const words = content.split(/\s+/).filter(Boolean).length;
      const publishDate = fm.publishDate;
      const published = new Date(publishDate).getTime() <= today().getTime();
      out.push({
        ...fm,
        body: content,
        bodyFormat: "markdown",
        readingMinutes: Math.max(1, Math.round(words / 200)),
        published,
      });
    }
  }
  out.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  _cache = out;
  return out;
}

export function getPublishedArticles(): Article[] {
  return getAllArticles().filter((a) => a.published);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByPractice(practice: string): Article[] {
  return getAllArticles().filter((a) => a.practice === practice);
}

export function getPillars(): Article[] {
  return getAllArticles().filter((a) => a.type === "pillar");
}

export function getRelated(article: Article): Article[] {
  const slugs = article.related ?? [];
  const found = slugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is Article => Boolean(a));
  if (found.length >= 3) return found.slice(0, 3);
  // Backfill with siblings from the same practice.
  const siblings = getArticlesByPractice(article.practice).filter(
    (a) => a.slug !== article.slug && !slugs.includes(a.slug),
  );
  return [...found, ...siblings].slice(0, 3);
}

export function getPracticePillar(practice: string): Article | undefined {
  return getArticlesByPractice(practice).find((a) => a.type === "pillar");
}

/** All FAQs across published articles, grouped by practice — for the FAQ hub. */
export function getAllFaqs(): { practice: string; article: Article; faq: Faq }[] {
  const rows: { practice: string; article: Article; faq: Faq }[] = [];
  for (const a of getPublishedArticles()) {
    for (const faq of a.faqs ?? []) {
      rows.push({ practice: a.practice, article: a, faq });
    }
  }
  return rows;
}
