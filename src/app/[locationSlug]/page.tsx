import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { practiceMap } from "@/data/practices";
import { allLocations, locationBySlug } from "@/lib/source/structured";
import { articleBySlug } from "@/lib/source/articles";
import { pageMeta } from "@/lib/seo";
import { graph, legalServiceLocationSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await allLocations()).map((l) => ({ locationSlug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locationSlug]">): Promise<Metadata> {
  const { locationSlug } = await params;
  const loc = await locationBySlug(locationSlug);
  if (!loc) return {};
  return pageMeta({
    title: loc.title,
    description: loc.metaDescription,
    path: `/${loc.slug}`,
  });
}

export default async function LocationPage({
  params,
}: PageProps<"/[locationSlug]">) {
  const { locationSlug } = await params;
  const loc = await locationBySlug(locationSlug);
  if (!loc) notFound();

  const practice = practiceMap[loc.practice];
  const locations = await allLocations();
  const linked = await Promise.all(loc.articles.map((s) => articleBySlug(s)));
  const linkedArticles = linked.filter((a) => a && a.published);

  return (
    <>
      <JsonLd
        data={graph(
          legalServiceLocationSchema({
            name: `${loc.service} lawyer in ${loc.city} — Brill Legal`,
            description: loc.metaDescription,
            city: loc.city,
            url: `/${loc.slug}`,
          }),
        )}
      />

      {/* Header band */}
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs
            items={[
              { name: practice?.name ?? "Practices", url: `/practices/${loc.practice}` },
              { name: `${loc.service} lawyer in ${loc.city}`, url: `/${loc.slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <p className="kicker">{loc.city}, Maharashtra</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {loc.service} Lawyer in {loc.city}
            </h1>
            <div className="gold-rule mt-5" />
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {loc.localContext}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                href={`/contact?matter=${encodeURIComponent(practice?.matterType ?? "")}`}
              >
                Talk to us
              </Button>
              {practice && (
                <Button href={`/practices/${practice.slug}`} variant="outline">
                  About this practice
                </Button>
              )}
            </div>
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="max-w-3xl">
          <section>
            <h2 className="text-2xl">Where matters are heard</h2>
            <ul className="mt-4 space-y-2 text-muted">
              {loc.courts.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-accent-deep">—</span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-muted">
              We are based in Pune and advise clients in {loc.city} for{" "}
              {loc.service.toLowerCase()} matters. Where a personal appearance is
              required, we coordinate with local counsel; routine steps are
              handled efficiently by phone, video and WhatsApp. Contact routes to
              our Pune office.
            </p>
          </section>

          {linkedArticles.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl">Helpful guides</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {linkedArticles.map(
                  (a) =>
                    a && (
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
                    ),
                )}
              </ul>
            </section>
          )}

          <FaqList faqs={loc.faqs} heading={`${loc.service} in ${loc.city}: FAQs`} />

          <CtaBand
            matter={`${loc.service.toLowerCase()} matters in ${loc.city}`}
            matterType={practice?.matterType}
          />
        </div>

        <aside className="space-y-8">
          <div className="border border-line bg-paper-card p-6">
            <h3 className="text-lg">Other cities</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {locations
                .filter((l) => l.service === loc.service && l.slug !== loc.slug)
                .map((l) => (
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
            <h3 className="mt-6 text-lg">More in {loc.city}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {locations
                .filter((l) => l.city === loc.city && l.slug !== loc.slug)
                .slice(0, 6)
                .map((l) => (
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
        </aside>
      </Container>
    </>
  );
}
