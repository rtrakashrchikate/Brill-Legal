import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { practices, subPracticeBySlug } from "@/data/practices";
import { articleBySlug } from "@/lib/source/articles";
import { pageMeta } from "@/lib/seo";
import { graph, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  return practices.flatMap((p) =>
    p.subPractices.map((s) => ({ practice: p.slug, service: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/practices/[practice]/[service]">): Promise<Metadata> {
  const { practice, service } = await params;
  const found = subPracticeBySlug(practice, service);
  if (!found) return {};
  return pageMeta({
    title: `${found.sub.name} — ${found.practice.short}`,
    description: found.sub.summary,
    path: `/practices/${practice}/${service}`,
  });
}

export default async function SubPracticePage({
  params,
}: PageProps<"/practices/[practice]/[service]">) {
  const { practice, service } = await params;
  const found = subPracticeBySlug(practice, service);
  if (!found) notFound();
  const { practice: p, sub } = found;

  const linked = (await Promise.all(sub.articles.map((s) => articleBySlug(s))))
    .filter((a) => a && a.published)
    .filter(Boolean);

  // Sibling service lines within the same area (for cross-linking).
  const siblings = p.subPractices.filter((s) => s.slug !== sub.slug);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Practices", url: "/practices" },
            { name: p.name, url: `/practices/${p.slug}` },
            { name: sub.name, url: `/practices/${p.slug}/${sub.slug}` },
          ]),
          ...(sub.faqs.length ? [faqSchema(sub.faqs)] : []),
        )}
      />

      {/* Header band */}
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs
            items={[
              { name: "Practices", url: "/practices" },
              { name: p.name, url: `/practices/${p.slug}` },
              { name: sub.name, url: `/practices/${p.slug}/${sub.slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <p className="kicker">
              <Link href={`/practices/${p.slug}`} className="hover:text-accent-deep">
                {p.name}
              </Link>
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {sub.name}
            </h1>
            <div className="gold-rule mt-5" />
            <p className="mt-5 text-lg leading-relaxed text-muted">{sub.intro}</p>
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
            <Reveal>
              <h2 className="font-display text-2xl">How we help</h2>
              <div className="gold-rule mt-3" />
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {sub.capabilities.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            {linked.length > 0 && (
              <Reveal>
                <h2 className="mt-14 font-display text-2xl">Related guides</h2>
                <div className="gold-rule mt-3" />
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {linked.map((a) => (
                    <li key={a!.slug}>
                      <Link
                        href={`/insights/${a!.slug}`}
                        className="group flex items-center justify-between gap-4 py-4 hover:text-accent-deep"
                      >
                        <span className="text-ink transition-colors group-hover:text-accent-deep">
                          {a!.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {a!.readingMinutes} min →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {sub.faqs.length > 0 && <FaqList faqs={sub.faqs} />}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-paper-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-lg">More in {p.short}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {siblings.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/practices/${p.slug}/${s.slug}`}
                      className="text-accent-deep hover:underline"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href={`/practices/${p.slug}`}
                    className="text-muted hover:text-accent-deep"
                  >
                    ← All {p.name}
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </section>

        <CtaBand matter={sub.name.toLowerCase()} matterType={p.matterType} />
      </Container>
    </>
  );
}
