import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { StatBand } from "@/components/StatBand";
import { CtaBand } from "@/components/CtaBand";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { site } from "@/config/site";
import { practices } from "@/data/practices";
import { allPeople } from "@/lib/source/structured";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Brill Legal",
  description:
    "Brill Legal is a full-service Indian law practice based in Pune, practising since 2007 across seven areas of law for individuals and businesses.",
  path: "/about",
});

const values = [
  {
    title: "Honest assessment first",
    text: "Before strategy comes a candid view of the merits. We tell clients what a matter is genuinely worth pursuing — and when it isn't.",
  },
  {
    title: "Plain English",
    text: "Law explained without ceremony. Our published guides exist so clients understand their position before the first conversation.",
  },
  {
    title: "Procedure-led strategy",
    text: "Cases are won on the route as much as the destination. We map the procedural path early and choose the forum deliberately.",
  },
  {
    title: "Discretion",
    text: "Legal matters are personal. Enquiries are confidential from the first message, whether or not an engagement follows.",
  },
];

export default async function AboutPage() {
  const people = await allPeople();

  return (
    <>
      {/* Editorial header band */}
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs items={[{ name: "About", url: "/about" }]} />
          <div className="mt-8 max-w-3xl">
            <SectionHeading
              kicker="About the firm"
              title="A full-service practice, built on substance."
              intro={`Practising since ${site.practisingSince} from ${site.baseCity}, ${site.baseState} — advising individuals and businesses across seven areas of Indian law.`}
            />
          </div>
        </Container>
      </header>

      {/* Narrative */}
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="prose max-w-none">
              <p>
                Brill Legal is a full-service Indian law practice based in{" "}
                {site.baseCity}, {site.baseState}. Practising since{" "}
                {site.practisingSince}, we advise and represent individuals and
                businesses across seven areas of law — from litigation and
                white-collar defence to real estate, family, arbitration,
                corporate and tribunal work.
              </p>
              <p>
                Our approach is measured. We assess matters honestly, explain
                the process in plain English, and pursue the remedy that fits —
                not the one that sounds impressive. That is also why we
                publish: our Insights library, glossary and resources exist so
                clients can understand their position before they pick up the
                phone.
              </p>
              <p>
                We are based in Pune and appear before the courts, tribunals
                and forums of Maharashtra, including the Bombay High Court,
                while advising clients across India and abroad.
              </p>
            </div>
          </Reveal>

          {/* Values rail */}
          <StaggerGroup className="space-y-px bg-line border border-line">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="group bg-paper-card p-6 transition-colors hover:bg-paper-dim/40">
                  <h3 className="font-display text-lg text-ink transition-colors group-hover:text-accent-deep">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {v.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>

      <StatBand />

      {/* Practices */}
      <Container className="py-16">
        <Reveal>
          <SectionHeading kicker="Our work" title="Seven practice areas" />
        </Reveal>
        <StaggerGroup className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {practices.map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                href={`/practices/${p.slug}`}
                className="group block border-l-2 border-accent pl-4 transition-colors"
              >
                <h3 className="text-lg transition-colors group-hover:text-accent-deep">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{p.summary}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>

      <TrustStrip />

      {/* People */}
      {people.length > 0 && (
        <Container className="py-16">
          <Reveal>
            <SectionHeading
              kicker="Our people"
              title="Named counsel, accountable work."
              intro="Every guide we publish carries its author's name, and every matter has a responsible partner."
            />
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-px bg-line sm:grid-cols-3 border border-line">
            {people.map((person) => (
              <StaggerItem key={person.slug}>
                <Link
                  href={`/people/${person.slug}`}
                  className="group flex h-full flex-col gap-3 bg-paper-card p-6 transition-colors hover:bg-paper-dim/40"
                >
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center bg-wine font-display text-lg font-semibold text-accent-soft"
                  >
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ink transition-colors group-hover:text-accent-deep">
                      {person.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted">{person.title}</p>
                  </div>
                  <span className="mt-auto text-xs font-medium text-accent-deep">
                    View profile →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      )}

      <Container>
        <CtaBand matter="your matter" />
      </Container>
    </>
  );
}
