import Link from "next/link";
import { site, telLink, waLink } from "@/config/site";
import { practices } from "@/data/practices";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-2xl font-semibold">Brill Legal</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              {site.tagline}
            </p>
            <p className="mt-4 text-sm text-paper/70">
              Practising since {site.practisingSince}.<br />
              {site.baseCity}, {site.baseState}.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper/50">
              Practices
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/practices/${p.slug}`}
                    className="text-paper/80 hover:text-paper"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper/50">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["/insights", "Insights"],
                ["/faqs", "FAQs"],
                ["/glossary", "Glossary"],
                ["/resources", "Resources"],
                ["/people", "People"],
                ["/news", "News"],
                ["/sitemap", "Sitemap"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-paper/80 hover:text-paper">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper/50">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={telLink()} className="text-paper/80 hover:text-paper">
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-paper/80 hover:text-paper"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/80 hover:text-paper"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/80 hover:text-paper"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-paper/15 pt-6 text-xs text-paper/50">
          <p>
            © {new Date().getFullYear()} {site.legalName}. This website is for
            general information only and is not legal advice. Use of this site
            does not create a lawyer–client relationship.
          </p>
        </div>
      </div>
    </footer>
  );
}
