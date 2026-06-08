import { site } from "@/config/site";
import { Container } from "@/components/ui";

/** Legitimate trust signals only — no fabricated stats or testimonials. */
export function TrustStrip() {
  return (
    <div className="border-y border-line bg-paper-card">
      <Container className="py-6">
        <ul className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {site.trust.map((t) => (
            <li key={t} className="text-sm font-medium text-ink">
              {t}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
