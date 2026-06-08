import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
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
  const index = practices.findIndex((x) => x.slug === p.slug);

  return (
    <>
      {/* Header band */}
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <span className="pointer-events-none absolute right-6 top-2 select-none font-display text-[9rem] leading-none text-line-strong/40 sm:text-[12rem]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs
            items={[
              { name: "Practices", url: "/practices" },
              { name: p.name, url: `/practices/${p.slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <p className="kicker">Practice area</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {p.name}
            </h1>
            <div className="gold-rule mt-5" />
            <p className="mt-5 text-lg leading-relaxed text-muted">{p.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/contact?matter=${encodeURIComponent(p.matterType)}`}
                className="group inline-flex items-center gap-2 rounded-[2px] bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                Talk to us
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-16">
        <section className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {pillars.length > 0 && (
              <>
                <Reveal>
                  <SectionHeading title="Cornerstone guides" />
                </Reveal>
                <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2">
                  {pillars.map((a) => (
                    <StaggerItem key={a.slug}>
                      <ArticleCard article={a} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </>
            )}

            {clusters.length > 0 && (
              <Reveal>
                <h2 className="mt-14 font-display text-2xl">Related guides</h2>
                <div className="gold-rule mt-3" />
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {clusters.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/insights/${a.slug}`}
                        className="group flex items-center justify-between gap-4 py-4 hover:text-accent-deep"
                      >
                        <span className="text-ink transition-colors group-hover:text-accent-deep">
                          {a.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {a.readingMinutes} min →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {articles.length === 0 && (
              <p className="text-muted">
                Guides for this practice are being published on our content
                calendar. In the meantime, please get in touch to discuss your
                matter.
              </p>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-paper-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-lg">What we help with</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {p.capabilities.map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {relatedLocations.length > 0 && (
              <div className="border border-line bg-paper-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-lg">By location</h3>
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
    </>
  );
}
