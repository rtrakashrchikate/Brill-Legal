import type { Faq } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { graph, faqSchema } from "@/lib/schema";

/** FAQ block with native <details> and FAQPage schema. */
export function FaqList({
  faqs,
  heading = "Frequently asked questions",
  withSchema = true,
}: {
  faqs: Faq[];
  heading?: string;
  withSchema?: boolean;
}) {
  if (!faqs.length) return null;
  return (
    <section className="mt-12">
      {withSchema && <JsonLd data={graph(faqSchema(faqs))} />}
      {heading && <h2 className="text-2xl">{heading}</h2>}
      <div className="mt-5 divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink">
              {f.q}
              <span className="text-accent-deep transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
