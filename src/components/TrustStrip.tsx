import { Container } from "@/components/ui";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";

/**
 * Credentials band — legitimate authority signals only (no testimonials, no
 * fabricated logos/numbers). Editorial oxblood treatment. The headline stats
 * live in the hero; this strip carries the qualitative credentials.
 */
const credentials = [
  { label: "Practising since 2007", note: "Nearly two decades of counsel" },
  { label: "Bar Council of Maharashtra & Goa", note: "Enrolled advocates" },
  { label: "Bombay High Court & tribunals", note: "Appearance & representation" },
  { label: "Pune · Mumbai · pan-India", note: "Served by consultation" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-paper-card">
      <Container className="py-10">
        <Reveal>
          <p className="kicker text-center">Why clients trust Brill Legal</p>
        </Reveal>
        <StaggerGroup className="mt-7 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((c) => (
            <StaggerItem key={c.label}>
              <div className="card-lift group flex h-full flex-col justify-between gap-3 bg-paper-card p-6 hover:bg-paper-dim/40">
                <span
                  aria-hidden
                  className="font-display text-lg leading-none text-accent/40 transition-colors group-hover:text-accent"
                >
                  ✦
                </span>
                <div>
                  <p className="font-display text-base leading-snug text-ink">
                    {c.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                    {c.note}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
