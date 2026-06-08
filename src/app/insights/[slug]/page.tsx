import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Markdown } from "@/components/Markdown";
import { FaqList } from "@/components/FaqList";
import { CtaBand } from "@/components/CtaBand";
import { ArticleCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllArticles,
  getArticleBySlug,
  getRelated,
  getPracticePillar,
} from "@/lib/content";
import { practiceMap } from "@/data/practices";
import { authorOf } from "@/data/people";
import { pageMeta } from "@/lib/seo";
import { site } from "@/config/site";
import {
  graph,
  articleSchema,
  howToSchema,
} from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) return {};
  return pageMeta({
    title: a.title,
    description: a.description,
    path: `/insights/${a.slug}`,
    type: "article",
    noindex: !a.published,
    publishedTime: a.publishDate,
    authors: [authorOf(a.author).name],
  });
}

export default async function ArticlePage({
  params,
}: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const practice = practiceMap[article.practice];
  const author = authorOf(article.author);
  const related = getRelated(article);
  const pillar = getPracticePillar(article.practice);
  const authorUrl = `${site.url}/people/${author.slug}`;

  const schemas: object[] = [articleSchema(article, authorUrl)];
  if (article.howto) {
    schemas.push(howToSchema(article.howto.name, article.howto.steps));
  }

  return (
    <Container className="py-12">
      <JsonLd data={graph(...schemas)} />
      <Breadcrumbs
        items={[
          { name: "Insights", url: "/insights" },
          ...(practice
            ? [{ name: practice.short, url: `/practices/${practice.slug}` }]
            : []),
          { name: article.title, url: `/insights/${article.slug}` },
        ]}
      />

      {!article.published && (
        <div className="mt-6 border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-accent-deep">
          This guide is scheduled for publication on{" "}
          {new Date(article.publishDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </div>
      )}

      <article className="mt-8">
        <header className="max-w-3xl">
          {practice && (
            <Link href={`/practices/${practice.slug}`} className="kicker">
              {practice.name}
            </Link>
          )}
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {article.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <Link
              href={`/people/${author.slug}`}
              className="font-medium text-ink hover:text-accent-deep"
            >
              {author.name}
            </Link>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} min read</span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishDate}>
              {new Date(article.publishDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="max-w-3xl">
            <Markdown>{article.body}</Markdown>

            <FaqList faqs={article.faqs ?? []} />

            <CtaBand
              matter={practice ? practice.name.toLowerCase() : "your matter"}
              matterType={practice?.matterType}
            />
          </div>

          <aside className="space-y-8 lg:pt-2">
            <div className="border border-line bg-paper-card p-6">
              <p className="text-sm font-medium text-ink">Written by</p>
              <Link
                href={`/people/${author.slug}`}
                className="mt-1 block text-accent-deep hover:underline"
              >
                {author.name}
              </Link>
              {author.title && (
                <p className="mt-0.5 text-sm text-muted">{author.title}</p>
              )}
            </div>

            {pillar && pillar.slug !== article.slug && (
              <div className="border border-line bg-paper-card p-6">
                <p className="kicker">Start here</p>
                <Link
                  href={`/insights/${pillar.slug}`}
                  className="mt-2 block text-ink hover:text-accent-deep"
                >
                  {pillar.title}
                </Link>
              </div>
            )}
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-8 border-t border-line pt-12">
          <h2 className="text-2xl">Related guides</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
