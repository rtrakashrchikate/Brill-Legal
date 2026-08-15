import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EngagementBar } from "@/components/engagement/EngagementBar";
import { CtaBand } from "@/components/home/CtaBand";
import { Reveal } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/CoverArt";
import { GlassCard } from "@/components/ui/GlassCard";
import { canonical, newsSchema } from "@/lib/seo";
import { getNews, getNewsItem } from "@/lib/source/content";
import { formatDate, formatNumber } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getNews()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return { title: "Project not found" };

  return {
    title: item.title,
    description: item.summary,
    alternates: canonical(`/news/${item.slug}`),
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      publishedTime: item.publishedAt,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();

  const all = await getNews();
  const related = all
    .filter((entry) => entry.id !== item.id && entry.impactArea === item.impactArea)
    .slice(0, 3);

  return (
    <>
      <JsonLd schema={newsSchema(item)} />

      <article className="relative isolate">
        <Aurora variant="soft" />

        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Reveal y={12}>
            <Breadcrumbs
              trail={[
                { name: "Home", path: "/" },
                { name: "Rotaract News", path: "/news" },
                { name: item.title, path: `/news/${item.slug}` },
              ]}
            />
          </Reveal>

          <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="cranberry">{item.district}</Badge>
            <Badge tone="royal">{item.impactArea}</Badge>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[2.7rem]">
              {item.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-fg-muted">{item.summary}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-fg-muted">
            <span className="font-medium text-fg">{item.club}</span>
            <span aria-hidden>·</span>
            <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
            {item.beneficiaries > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{formatNumber(item.beneficiaries)} people reached</span>
              </>
            )}
          </Reveal>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-4xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <CoverArt
              seed={item.id}
              className="h-48 w-full rounded-3xl sm:h-72"
              label={`Artwork for ${item.title}`}
            />
          </Reveal>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-3xl px-4 sm:px-6">
          <Reveal>
            <p className="rounded-2xl border border-gold-500/25 bg-gold-500/8 px-5 py-4 text-[0.92rem] font-medium text-gold-700 dark:text-gold-300">
              {item.impactMetric}
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-5">
            {(item.body ?? [item.summary]).map((block, index) =>
              block.startsWith("## ") ? (
                <Reveal key={index} y={14}>
                  <h2 className="mt-6 font-display text-[1.4rem] font-semibold tracking-tight sm:text-[1.6rem]">
                    {block.replace("## ", "")}
                  </h2>
                </Reveal>
              ) : (
                <Reveal key={index} y={14}>
                  <p className="text-[1.02rem] leading-[1.85] text-fg/90">{block}</p>
                </Reveal>
              ),
            )}
          </div>

          {item.replicate && item.replicate.length > 0 && (
            <Reveal className="mt-10">
              <GlassCard padding="lg" accent="royal">
                <h2 className="font-display text-lg font-semibold">
                  If your club wants to copy this
                </h2>
                <p className="mt-1.5 text-[0.84rem] text-fg-muted">
                  The parts that actually decided the outcome.
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {item.replicate.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-fg-muted"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-royal-600"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          )}

          {item.sourceUrl && (
            <Reveal className="mt-6">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-cranberry-600 dark:text-cranberry-400"
              >
                Read the club&rsquo;s own report
                <ArrowRight className="size-4" />
              </a>
            </Reveal>
          )}

          <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-8">
            <p className="text-[0.8rem] text-fg-muted">
              Worth applauding? React below — no account needed.
            </p>
            <EngagementBar type="news" id={item.id} trackView />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold">
            More in {item.impactArea}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((entry, index) => (
              <Reveal key={entry.id} delay={index * 0.06} className="h-full">
                <Link href={`/news/${entry.slug}`} className="block h-full">
                  <GlassCard interactive padding="md" className="flex h-full flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone="cranberry">{entry.district}</Badge>
                    </div>
                    <h3 className="text-[1rem] font-semibold leading-snug">{entry.title}</h3>
                    <p className="line-clamp-3 text-[0.84rem] leading-relaxed text-fg-muted">
                      {entry.summary}
                    </p>
                    <p className="mt-auto pt-3 text-[0.76rem] font-semibold text-gold-700 dark:text-gold-300">
                      {entry.impactMetric}
                    </p>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
