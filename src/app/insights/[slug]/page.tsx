import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleBody } from "@/components/ArticleBody";
import { FaqList } from "@/components/FaqList";
import { CtaBand } from "@/components/CtaBand";
import { ArticleCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareRow } from "@/components/ShareRow";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import {
  articleSlugs,
  articleBySlug,
  relatedTo,
  practicePillar,
} from "@/lib/source/articles";
import { practiceMap } from "@/data/practices";
import { authorBySlug } from "@/lib/source/structured";
import { pageMeta } from "@/lib/seo";
import { site } from "@/config/site";
import { graph, articleSchema, howToSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await articleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await articleBySlug(slug);
  if (!a) return {};
  return pageMeta({
    title: a.title,
    description: a.description,
    path: `/insights/${a.slug}`,
    type: "article",
    noindex: !a.published,
    publishedTime: a.publishDate,
    authors: [(await authorBySlug(a.author)).name],
  });
}

export default async function ArticlePage({
  params,
}: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = await articleBySlug(slug);
  if (!article) notFound();

  const practice = practiceMap[article.practice];
  const author = await authorBySlug(article.author);
  const related = await relatedTo(article);
  const pillar = await practicePillar(article.practice);
  const authorUrl = `${site.url}/people/${author.slug}`;
  const dateLabel = new Date(article.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const schemas: object[] = [articleSchema(article, authorUrl)];
  if (article.howto) {
    schemas.push(howToSchema(article.howto.name, article.howto.steps));
  }

  return (
    <>
      <ReadingProgress />
      <JsonLd data={graph(...schemas)} />

      {/* Header band */}
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-12 pt-10">
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
            <div className="mt-6 inline-block border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent-deep">
              Scheduled for publication on {dateLabel}.
            </div>
          )}

          <div className="mt-8 max-w-3xl">
            {practice && (
              <Link href={`/practices/${practice.slug}`} className="kicker">
                {practice.name}
              </Link>
            )}
            <h1 className="mt-3 font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {article.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              <Link
                href={`/people/${author.slug}`}
                className="font-medium text-ink hover:text-accent-deep"
              >
                {author.name}
              </Link>
              <span aria-hidden>·</span>
              <span>{article.readingMinutes} min read</span>
              <span aria-hidden>·</span>
              <time dateTime={article.publishDate}>{dateLabel}</time>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-14">
        <article className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="article-body max-w-3xl">
            <ArticleBody article={article} />

            <div className="mt-12 border-t border-line pt-6">
              <ShareRow slug={article.slug} title={article.title} />
            </div>

            <FaqList faqs={article.faqs ?? []} />

            <CtaBand
              matter={practice ? practice.name.toLowerCase() : "your matter"}
              matterType={practice?.matterType}
            />
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-paper-card p-6 shadow-[var(--shadow-card)]">
              <p className="text-sm font-medium text-ink">Written by</p>
              <Link
                href={`/people/${author.slug}`}
                className="mt-1 block font-display text-lg text-accent-deep hover:underline"
              >
                {author.name}
              </Link>
              {author.title && (
                <p className="mt-0.5 text-sm text-muted">{author.title}</p>
              )}
            </div>

            {pillar && pillar.slug !== article.slug && (
              <div className="bg-wine border border-line p-6 text-paper">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
                  Start here
                </p>
                <Link
                  href={`/insights/${pillar.slug}`}
                  className="mt-2 block font-display text-lg text-paper hover:text-accent-soft"
                >
                  {pillar.title}
                </Link>
                <p className="mt-2 text-sm text-paper/60">
                  The cornerstone guide for this practice.
                </p>
              </div>
            )}

            {practice && (
              <div className="border border-line bg-paper-card p-6 shadow-[var(--shadow-card)]">
                <p className="text-sm font-medium text-ink">Practice area</p>
                <Link
                  href={`/practices/${practice.slug}`}
                  className="mt-1 block text-accent-deep hover:underline"
                >
                  {practice.name}
                </Link>
              </div>
            )}
          </aside>
        </article>

        {related.length > 0 && (
          <section className="mt-8 border-t border-line pt-14">
            <Reveal>
              <h2 className="font-display text-2xl">Related guides</h2>
              <div className="gold-rule mt-3" />
            </Reveal>
            <StaggerGroup className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <StaggerItem key={a.slug}>
                  <ArticleCard article={a} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}
      </Container>
    </>
  );
}
