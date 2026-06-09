import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  allPractices,
  allLocations,
  allGlossary,
  allResources,
  allPeople,
  allNews,
} from "@/lib/source/structured";
import { publishedArticles } from "@/lib/source/articles";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Sitemap",
  description:
    "A human-readable index of everything on the Brill Legal website — practices, guides, locations, glossary and resources.",
  path: "/sitemap",
});

function Group({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <section>
      <h2 className="text-xl">{title}</h2>
      <ul className="mt-3 columns-1 gap-8 sm:columns-2 lg:columns-3 [&>li]:mb-1.5">
        {links.map((l) => (
          <li key={l.href} className="break-inside-avoid">
            <Link href={l.href} className="text-sm text-accent-deep hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function HtmlSitemapPage() {
  const [articles, practices, locations, glossary, resources, people, news] =
    await Promise.all([
      publishedArticles(),
      allPractices(),
      allLocations(),
      allGlossary(),
      allResources(),
      allPeople(),
      allNews(),
    ]);
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Sitemap", url: "/sitemap" }]} />
      <div className="mt-8">
        <SectionHeading kicker="Index" title="Sitemap" />
      </div>

      <div className="mt-10 space-y-12">
        <Group
          title="Main pages"
          links={[
            { href: "/", label: "Home" },
            { href: "/practices", label: "Practices" },
            { href: "/insights", label: "Insights" },
            { href: "/people", label: "People" },
            { href: "/resources", label: "Resources" },
            { href: "/glossary", label: "Glossary" },
            { href: "/faqs", label: "FAQs" },
            { href: "/news", label: "News" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ]}
        />
        <Group
          title="Practice areas"
          links={practices.map((p) => ({
            href: `/practices/${p.slug}`,
            label: p.name,
          }))}
        />
        <Group
          title="Locations"
          links={locations.map((l) => ({
            href: `/${l.slug}`,
            label: `${l.service} lawyer in ${l.city}`,
          }))}
        />
        {articles.length > 0 && (
          <Group
            title="Guides"
            links={articles.map((a) => ({
              href: `/insights/${a.slug}`,
              label: a.title,
            }))}
          />
        )}
        <Group
          title="Glossary"
          links={glossary.map((g) => ({
            href: `/glossary/${g.slug}`,
            label: g.term,
          }))}
        />
        <Group
          title="Resources"
          links={resources.map((r) => ({
            href: `/resources/${r.slug}`,
            label: r.title,
          }))}
        />
        <Group
          title="People"
          links={people.map((p) => ({
            href: `/people/${p.slug}`,
            label: p.name,
          }))}
        />
        <Group
          title="News"
          links={news.map((n) => ({ href: `/news/${n.slug}`, label: n.title }))}
        />
      </div>
    </Container>
  );
}
