import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { glossary, glossaryBySlug } from "@/data/glossary";
import { practiceMap } from "@/data/practices";
import { getArticleBySlug } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return glossary.map((g) => ({ term: g.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/glossary/[term]">): Promise<Metadata> {
  const { term } = await params;
  const g = glossaryBySlug(term);
  if (!g) return {};
  return pageMeta({
    title: `${g.term} — Meaning & Definition`,
    description: g.definition,
    path: `/glossary/${g.slug}`,
  });
}

export default async function GlossaryTermPage({
  params,
}: PageProps<"/glossary/[term]">) {
  const { term } = await params;
  const g = glossaryBySlug(term);
  if (!g) notFound();

  const practice = g.practice ? practiceMap[g.practice] : undefined;
  const article = g.article ? getArticleBySlug(g.article) : undefined;
  const related = glossary
    .filter((x) => x.practice === g.practice && x.slug !== g.slug)
    .slice(0, 6);

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { name: "Glossary", url: "/glossary" },
          { name: g.term, url: `/glossary/${g.slug}` },
        ]}
      />
      <article className="mt-8 max-w-2xl">
        <p className="kicker">Legal term</p>
        <h1 className="mt-3 font-display text-4xl text-ink">{g.term}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          {g.definition}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {practice && (
            <Link
              href={`/practices/${practice.slug}`}
              className="border border-line px-4 py-2 text-ink hover:border-accent"
            >
              {practice.name}
            </Link>
          )}
          {article && article.published && (
            <Link
              href={`/insights/${article.slug}`}
              className="border border-line px-4 py-2 text-ink hover:border-accent"
            >
              Read the guide: {article.title}
            </Link>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl">Related terms</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/glossary/${r.slug}`}
                    className="border border-line px-3 py-1.5 text-sm text-accent-deep hover:border-accent"
                  >
                    {r.term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {practice && (
        <CtaBand matter={practice.name.toLowerCase()} matterType={practice.matterType} />
      )}
    </Container>
  );
}
