import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { practiceMap } from "@/data/practices";
import { allResources, resourceBySlug } from "@/lib/source/structured";
import { articleBySlug } from "@/lib/source/articles";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await allResources()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await resourceBySlug(slug);
  if (!r) return {};
  return pageMeta({
    title: r.title,
    description: r.description,
    path: `/resources/${r.slug}`,
  });
}

export default async function ResourcePage({
  params,
}: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const r = await resourceBySlug(slug);
  if (!r) notFound();

  const practice = practiceMap[r.practice];
  const article = r.relatedArticle ? await articleBySlug(r.relatedArticle) : undefined;

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { name: "Resources", url: "/resources" },
          { name: r.title, url: `/resources/${r.slug}` },
        ]}
      />

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-w-2xl">
          <p className="kicker">{practice?.name ?? "Checklist"}</p>
          <h1 className="mt-3 font-display text-4xl text-ink">{r.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {r.description}
          </p>

          <ul className="mt-8 divide-y divide-line border-y border-line">
            {r.items.map((item) => (
              <li key={item} className="flex items-start gap-3 py-3">
                <span className="mt-1 h-4 w-4 shrink-0 border border-accent" />
                <span className="text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>

          {article && article.published && (
            <p className="mt-8 text-muted">
              Want the detail behind this checklist? Read{" "}
              <Link
                href={`/insights/${article.slug}`}
                className="text-accent-deep underline"
              >
                {article.title}
              </Link>
              .
            </p>
          )}
        </div>

        <aside>
          <div className="border border-line bg-ink p-7 text-paper">
            <h2 className="text-xl text-paper">Get the checklist</h2>
            <p className="mt-2 text-sm text-paper/70">
              Leave your email and we&apos;ll send a printable copy — and you can
              ask us anything about your matter.
            </p>
            <form className="mt-5 space-y-3">
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full border border-paper/30 bg-transparent px-3 py-2.5 text-sm text-paper placeholder:text-paper/50"
                aria-label="Email"
              />
              <button
                type="submit"
                className="w-full rounded-[2px] bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
              >
                Email me the checklist
              </button>
            </form>
            <p className="mt-3 text-xs text-paper/50">
              We&apos;ll only use your email to send what you asked for and to
              follow up if you raise a matter.
            </p>
          </div>
        </aside>
      </div>

      {practice && (
        <CtaBand
          matter={practice.name.toLowerCase()}
          matterType={practice.matterType}
        />
      )}
    </Container>
  );
}
