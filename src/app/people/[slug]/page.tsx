import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { practiceMap } from "@/data/practices";
import { allPeople, personBySlug } from "@/lib/source/structured";
import { publishedArticles } from "@/lib/source/articles";
import { pageMeta } from "@/lib/seo";
import { graph, personSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await allPeople()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await personBySlug(slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} — ${p.title}`,
    description: p.bio,
    path: `/people/${p.slug}`,
  });
}

export default async function PersonPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const p = await personBySlug(slug);
  if (!p || p.slug === "brill-legal") notFound();

  const authored = (await publishedArticles()).filter(
    (a) => a.author === p.slug,
  );

  return (
    <>
      <JsonLd data={graph(personSchema(p))} />
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs
            items={[
              { name: "People", url: "/people" },
              { name: p.name, url: `/people/${p.slug}` },
            ]}
          />
          <div className="mt-8 max-w-2xl">
            <p className="kicker">{p.title}</p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              {p.name}
            </h1>
            <div className="gold-rule mt-5" />
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-muted">{p.bio}</p>

          {authored.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Guides by {p.name}</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {authored.map((a) => (
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
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="border border-line bg-paper-card p-6">
            <h3 className="text-lg">Focus areas</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {p.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          {p.practices.length > 0 && (
            <div className="border border-line bg-paper-card p-6">
              <h3 className="text-lg">Practices</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.practices.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/practices/${slug}`}
                      className="text-accent-deep hover:underline"
                    >
                      {practiceMap[slug]?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(p.education.length > 0 || p.enrolment) && (
            <div className="border border-line bg-paper-card p-6">
              <h3 className="text-lg">Credentials</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                {p.education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
                {p.enrolment && <li>{p.enrolment}</li>}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      <CtaBand matter="your matter" />
    </>
  );
}
