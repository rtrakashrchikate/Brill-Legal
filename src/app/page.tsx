import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { TrustStrip } from "@/components/TrustStrip";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { BentoPracticeCards } from "@/components/BentoPracticeCards";
import { allPractices } from "@/lib/source/structured";
import { pillars as sourcePillars, publishedArticles } from "@/lib/source/articles";

const forums = [
  "Bombay High Court",
  "MahaRERA",
  "NCLT, Mumbai",
  "Pune District Court",
  "DRT & SARFAESI",
  "Consumer Commissions",
  "Family Courts",
  "Arbitral Tribunals",
  "Supreme Court of India",
];

export default async function Home() {
  const practices = await allPractices();
  const pillars = (await sourcePillars())
    .filter((a) => a.published)
    .slice(0, 6);
  const latest = (await publishedArticles()).slice(0, 3);

  return (
    <>
      <Hero />

      {/* Forums strip */}
      <div className="border-b border-line bg-paper py-5">
        <Container>
          <Marquee
            items={forums.map((f) => (
              <span key={f} className="font-medium tracking-wide text-ink/60">
                {f}
              </span>
            ))}
          />
        </Container>
      </div>

      <TrustStrip />

      {/* Practices */}
      <section className="py-24">
        <Container>
          <Reveal>
            <SectionHeading
              kicker="What we do"
              title="Seven practice areas, one standard."
              intro="Deep capability across the areas that matter most to our clients — explained plainly, advised honestly."
            />
          </Reveal>
          <div className="mt-14">
            <BentoPracticeCards practices={practices} />
          </div>
        </Container>
      </section>

      {/* Established feel band */}
      <section className="bg-wine relative overflow-hidden border-y border-line text-paper">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
                The firm
              </p>
              <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.05] text-paper sm:text-5xl">
                Substance, executed{" "}
                <span className="italic text-gold">beautifully</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-paper/75">
                Brill Legal reads like a much larger firm — through depth of
                practice, a serious body of published work, and clear, named
                counsel. No fabricated claims; just genuine expertise, presented
                with the restraint that sophisticated clients trust.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="rounded-[2px] border border-paper/30 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  About the firm
                </Link>
                <Link
                  href="/people"
                  className="rounded-[2px] bg-paper px-5 py-3 text-sm font-medium text-accent-deep transition-colors hover:bg-accent-soft hover:text-ink"
                >
                  Meet our people
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Pillar guides */}
      {pillars.length > 0 && (
        <section className="py-24">
          <Container>
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <SectionHeading
                  kicker="Insights"
                  title="Cornerstone guides."
                  intro="In-depth, plain-English guides to the law that affects you — the anchors of our growing library."
                />
                <Link
                  href="/insights"
                  className="hidden whitespace-nowrap text-sm font-medium text-accent-deep hover:underline sm:block"
                >
                  All insights →
                </Link>
              </div>
            </Reveal>
            <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pillars.map((a) => (
                <StaggerItem key={a.slug}>
                  <ArticleCard article={a} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Container>
        </section>
      )}

      {/* Locations */}
      <section className="border-t border-line bg-paper-dim/40 py-24">
        <Container>
          <Reveal>
            <SectionHeading
              kicker="Where we work"
              title="Serving clients in Pune and Mumbai."
              intro="Based in Pune, we appear before the courts, tribunals and forums of Maharashtra and advise clients across India."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                ["criminal-lawyer-in-pune", "Criminal — Pune"],
                ["anticipatory-bail-lawyer-in-pune", "Anticipatory Bail — Pune"],
                ["rera-lawyer-in-pune", "RERA — Pune"],
                ["divorce-lawyer-in-pune", "Divorce — Pune"],
                ["property-lawyer-in-mumbai", "Property — Mumbai"],
                ["arbitration-lawyer-in-mumbai", "Arbitration — Mumbai"],
                ["corporate-lawyer-in-pune", "Corporate — Pune"],
                ["cheque-bounce-lawyer-in-mumbai", "Cheque Bounce — Mumbai"],
              ].map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="card-lift border border-line bg-paper-card px-4 py-2.5 text-sm text-ink hover:border-accent/60"
                >
                  {label}
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Latest + resources */}
      {latest.length > 0 && (
        <section className="py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Reveal>
                  <SectionHeading kicker="Latest" title="From the Insights library." />
                </Reveal>
                <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2">
                  {latest.map((a) => (
                    <StaggerItem key={a.slug}>
                      <ArticleCard article={a} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
              <Reveal delay={0.1}>
                <div className="bg-wine flex h-full flex-col justify-between border border-line p-8 text-paper">
                  <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
                      Resources
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-paper">
                      Free checklists &amp; guides
                    </h3>
                    <p className="mt-3 text-sm text-paper/70">
                      Practical, downloadable checklists — property due diligence,
                      startup legal, RERA complaints and more.
                    </p>
                  </div>
                  <Link
                    href="/resources"
                    className="mt-8 rounded-[2px] bg-paper px-5 py-3 text-center text-sm font-medium text-accent-deep transition-colors hover:bg-accent-soft hover:text-ink"
                  >
                    Browse resources
                  </Link>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
