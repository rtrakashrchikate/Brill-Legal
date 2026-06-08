import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading, Button } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { practices, practiceBySlug } from "@/data/practices";
import { getArticlesByPractice } from "@/lib/content";
import { locations } from "@/data/locations";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return practices.map((p) => ({ practice: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/practices/[practice]">): Promise<Metadata> {
  const { practice } = await params;
  const p = practiceBySlug(practice);
  if (!p) return {};
  return pageMeta({
    title: p.name,
    description: p.summary,
    path: `/practices/${p.slug}`,
  });
}

export default async function PracticePage({
  params,
}: PageProps<"/practices/[practice]">) {
  const { practice } = await params;
  const p = practiceBySlug(practice);
  if (!p) notFound();

  const articles = getArticlesByPractice(p.slug).filter((a) => a.published);
  const pillars = articles.filter((a) => a.type === "pillar");
  const clusters = articles.filter((a) => a.type === "cluster");
  const relatedLocations = locations.filter((l) => l.practice === p.slug);

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { name: "Practices", url: "/practices" },
          { name: p.name, url: `/practices/${p.slug}` },
        ]}
      />

      <header className="mt-8 max-w-3xl">
        <p className="kicker">Practice area</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
          {p.name}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{p.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={`/contact?matter=${encodeURIComponent(p.matterType)}`}>
            Talk to us
          </Button>
        </div>
      </header>

      <section className="mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {pillars.length > 0 && (
            <>
              <SectionHeading title="Cornerstone guides" />
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {pillars.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </>
          )}

          {clusters.length > 0 && (
            <>
              <h2 className="mt-12 text-2xl">Related guides</h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {clusters.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/insights/${a.slug}`}
                      className="flex items-center justify-between gap-4 py-4 hover:text-accent-deep"
                    >
                      <span className="text-ink">{a.title}</span>
                      <span className="text-xs text-muted">
                        {a.readingMinutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {articles.length === 0 && (
            <p className="text-muted">
              Guides for this practice are being published on our content
              calendar. In the meantime, please get in touch to discuss your
              matter.
            </p>
          )}
        </div>

        <aside className="space-y-8">
          <div className="border border-line bg-paper-card p-6">
            <h3 className="text-lg">What we help with</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {p.capabilities.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-accent-deep">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {relatedLocations.length > 0 && (
            <div className="border border-line bg-paper-card p-6">
              <h3 className="text-lg">By location</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {relatedLocations.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/${l.slug}`}
                      className="text-accent-deep hover:underline"
                    >
                      {l.service} lawyer in {l.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <CtaBand matter={p.name.toLowerCase()} matterType={p.matterType} />
    </Container>
  );
}
