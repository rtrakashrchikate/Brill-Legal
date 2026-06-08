import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { graph, breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; url: string };

/** Visible breadcrumb trail + BreadcrumbList schema. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Home", url: "/" }, ...items];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(full))} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {full.map((c, i) => {
            const last = i === full.length - 1;
            return (
              <li key={c.url} className="flex items-center gap-1.5">
                {last ? (
                  <span className="text-ink">{c.name}</span>
                ) : (
                  <Link href={c.url} className="hover:text-accent-deep">
                    {c.name}
                  </Link>
                )}
                {!last && <span aria-hidden>/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
