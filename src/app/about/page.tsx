import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { CtaBand } from "@/components/CtaBand";
import { site } from "@/config/site";
import { practices } from "@/data/practices";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Brill Legal",
  description:
    "Brill Legal is a full-service Indian law practice based in Pune, practising since 2007 across seven areas of law for individuals and businesses.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Container className="py-12">
        <Breadcrumbs items={[{ name: "About", url: "/about" }]} />
        <div className="mt-8 max-w-3xl">
          <SectionHeading
            kicker="About the firm"
            title="A full-service practice, built on substance."
          />
          <div className="prose mt-6 max-w-none">
            <p>
              Brill Legal is a full-service Indian law practice based in{" "}
              {site.baseCity}, {site.baseState}. Practising since{" "}
              {site.practisingSince}, we advise and represent individuals and
              businesses across seven areas of law — from litigation and
              white-collar defence to real estate, family, arbitration,
              corporate and tribunal work.
            </p>
            <p>
              Our approach is measured. We assess matters honestly, explain the
              process in plain English, and pursue the remedy that fits — not the
              one that sounds impressive. That is also why we publish: our
              Insights library, glossary and resources exist so clients can
              understand their position before they pick up the phone.
            </p>
            <p>
              We are based in Pune and appear before the courts, tribunals and
              forums of Maharashtra, including the Bombay High Court, while
              advising clients across India and abroad.
            </p>
          </div>
        </div>
      </Container>

      <TrustStrip />

      <Container className="py-16">
        <SectionHeading kicker="Our work" title="Seven practice areas" />
        <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {practices.map((p) => (
            <div key={p.slug} className="border-l-2 border-accent pl-4">
              <h3 className="text-lg">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.summary}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <CtaBand matter="your matter" />
      </Container>
    </>
  );
}
