import Link from "next/link";
import { site } from "@/config/site";
import { practices } from "@/data/practices";
import { getSettings, waLinkFor, telLinkFor } from "@/lib/source/settings";

export async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-2xl font-semibold">{settings.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              {settings.tagline}
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
                <a
                  href={telLinkFor(settings.phoneDigits)}
                  className="text-paper/80 hover:text-paper"
                >
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-paper/80 hover:text-paper"
                >
                  {settings.email}
                </a>
              </li>
              <li>
                <a
                  href={waLinkFor(settings.whatsapp, site.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/80 hover:text-paper"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={settings.linkedin}
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
            © {new Date().getFullYear()} {settings.name}.{" "}
            {settings.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
