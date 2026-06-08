import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { news, newsBySlug } from "@/data/news";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = newsBySlug(slug);
  if (!n) return {};
  return pageMeta({
    title: n.title,
    description: n.summary,
    path: `/news/${n.slug}`,
    type: "article",
    publishedTime: n.date,
  });
}

export default async function NewsItemPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const n = newsBySlug(slug);
  if (!n) notFound();

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { name: "News", url: "/news" },
          { name: n.title, url: `/news/${n.slug}` },
        ]}
      />
      <article className="mt-8 max-w-2xl">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="kicker">{n.category}</span>
          <time dateTime={n.date}>
            {new Date(n.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink">
          {n.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{n.body}</p>
      </article>
      <CtaBand matter="your matter" />
    </Container>
  );
}
