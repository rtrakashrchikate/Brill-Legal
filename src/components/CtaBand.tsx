import Link from "next/link";
import { waLink } from "@/config/site";
import { Container } from "@/components/ui";

/**
 * Inline "Talk to us about [matter]" band, keyed to the page's practice.
 * Not a popup — an editorial CTA placed between content sections.
 */
export function CtaBand({
  matter,
  matterType,
}: {
  matter: string;
  matterType?: string;
}) {
  const contactHref = matterType
    ? `/contact?matter=${encodeURIComponent(matterType)}`
    : "/contact";
  return (
    <section className="bg-wine relative my-16 overflow-hidden text-paper">
      <div className="noise pointer-events-none absolute inset-0" />
      <Container className="relative py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
              Speak to a lawyer
            </p>
            <h2 className="mt-3 font-display text-2xl text-paper sm:text-3xl">
              Talk to us about {matter}.
            </h2>
            <p className="mt-3 text-paper/70">
              A short, confidential conversation about your matter — no
              obligation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={contactHref}
              className="rounded-[2px] bg-paper px-5 py-3 text-sm font-medium text-accent-deep transition-colors hover:bg-accent-soft hover:text-ink"
            >
              Request a Consultation
            </Link>
            <a
              href={waLink(`Hi, I'd like to ask about ${matter}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] border border-paper/30 px-5 py-3 text-sm font-medium text-paper hover:bg-paper hover:text-ink"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
