import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getAllFaqs } from "@/lib/content";
import { practices, practiceMap } from "@/data/practices";
import { pageMeta } from "@/lib/seo";
import { graph, faqSchema } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Answers to common legal questions across Brill Legal's practice areas — litigation, RERA, family, arbitration, corporate, white-collar and tribunal law.",
  path: "/faqs",
});

export default function FaqHubPage() {
  const rows = getAllFaqs();
  const byPractice = practices
    .map((p) => ({
      practice: p,
      faqs: rows.filter((r) => r.practice === p.slug),
    }))
    .filter((g) => g.faqs.length > 0);

  // One consolidated FAQPage schema (cap to keep the document lean).
  const schemaFaqs = rows.slice(0, 50).map((r) => r.faq);

  return (
    <Container className="py-12">
      <JsonLd data={graph(faqSchema(schemaFaqs))} />
      <Breadcrumbs items={[{ name: "FAQs", url: "/faqs" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="Answers"
          title="Frequently asked questions"
          intro="Common questions, grouped by practice area. Each links to the guide it comes from."
        />
      </div>

      <div className="mt-10 space-y-12">
        {byPractice.map(({ practice, faqs }) => (
          <section key={practice.slug}>
            <h2 className="text-2xl">
              <Link
                href={`/practices/${practice.slug}`}
                className="hover:text-accent-deep"
              >
                {practiceMap[practice.slug].name}
              </Link>
            </h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {faqs.map((r, i) => (
                <details key={`${r.article.slug}-${i}`} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink">
                    {r.faq.q}
                    <span className="text-accent-deep transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {r.faq.a}
                  </p>
                  <Link
                    href={`/insights/${r.article.slug}`}
                    className="mt-2 inline-block text-xs text-accent-deep hover:underline"
                  >
                    From: {r.article.title} →
                  </Link>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {byPractice.length === 0 && (
        <p className="mt-10 text-muted">
          FAQs will appear here as guides are published.
        </p>
      )}
    </Container>
  );
}
