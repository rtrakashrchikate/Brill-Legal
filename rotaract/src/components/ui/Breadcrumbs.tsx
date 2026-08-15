import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Visible breadcrumb trail plus its matching BreadcrumbList schema — the two
 * are generated from one array so the markup can never drift from the UI.
 */
export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <nav aria-label="Breadcrumb" className={cn("text-[0.76rem] text-fg-muted", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="transition-colors duration-300 hover:text-cranberry-600 dark:hover:text-cranberry-400"
                  >
                    {crumb.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden className="text-fg-muted/50">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
