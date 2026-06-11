import Link from "next/link";
import { site } from "@/config/site";
import { practices } from "@/data/practices";
import { getSettings, waLinkFor, telLinkFor } from "@/lib/source/settings";

const explore = [
  ["/insights", "Insights"],
  ["/faqs", "FAQs"],
  ["/glossary", "Glossary"],
  ["/resources", "Resources"],
  ["/people", "People"],
  ["/about", "About"],
  ["/news", "News"],
  ["/contact", "Contact"],
  ["/sitemap", "Sitemap"],
] as const;

const locations = [
  "Pune (HQ)",
  "Mumbai",
  "Pan-India consultations",
] as const;

export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-paper">
      {/* Oxblood top rule — the single editorial accent line */}
      <div className="h-px w-full bg-accent" />

      {/* Noise + grid texture layers */}
      <span aria-hidden className="noise pointer-events-none absolute inset-0" />
      <span aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0" />

      {/* Radial bloom bottom-left */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(98,20,32,0.45) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">

        {/* ── Top: CTA band ──────────────────────────────────── */}
        <div className="flex flex-col gap-6 border-b border-paper/10 py-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker text-accent-soft/80">Ready to speak with us?</p>
            <h2 className="mt-3 max-w-md font-display text-3xl leading-tight text-paper sm:text-4xl">
              Measured counsel,{" "}
              <span className="italic text-accent-soft">when it matters.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-[2px] bg-accent px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
            >
              Enquire now
            </Link>
            <a
              href={waLinkFor(settings.whatsapp, site.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] border border-paper/20 px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-paper/50 hover:bg-paper/5"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* ── Main grid ──────────────────────────────────────── */}
        <div className="grid gap-12 py-14 md:grid-cols-12">

          {/* Brand column — 4 cols */}
          <div className="md:col-span-4">
            {/* Oversized wordmark */}
            <Link href="/" className="group inline-block">
              <p className="font-display text-3xl font-semibold leading-none tracking-tight text-paper transition-colors group-hover:text-accent-soft sm:text-4xl">
                {settings.name}
              </p>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              {settings.tagline}
            </p>

            {/* NAP block — structured for schema */}
            <address className="mt-6 space-y-1.5 not-italic text-sm text-paper/50">
              <p>Practising since {site.practisingSince}</p>
              <p>{settings.address}</p>
              {settings.officeHours && <p>{settings.officeHours}</p>}
            </address>

            {/* Locations */}
            <div className="mt-5">
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/35">
                Locations
              </p>
              <ul className="space-y-1">
                {locations.map((loc) => (
                  <li key={loc} className="flex items-center gap-1.5 text-sm text-paper/55">
                    <span aria-hidden className="text-accent-soft/60">◉</span>
                    {loc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practices — 4 cols */}
          <div className="md:col-span-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/35">
              Practice areas
            </p>
            <ul className="mt-4 space-y-2.5">
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/practices/${p.slug}`}
                    className="group flex items-baseline gap-2 text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    <span
                      aria-hidden
                      className="text-[0.55rem] text-accent/40 transition-colors group-hover:text-accent-soft"
                    >
                      ▸
                    </span>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore + Contact — 4 cols, split internally */}
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-4">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/35">
                Explore
              </p>
              <ul className="mt-4 space-y-2.5">
                {explore.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/35">
                Contact
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href={telLinkFor(settings.phoneDigits)}
                    className="text-paper/70 transition-colors hover:text-paper"
                  >
                    {settings.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all text-paper/70 transition-colors hover:text-paper"
                  >
                    {settings.email}
                  </a>
                </li>
                <li>
                  <a
                    href={waLinkFor(settings.whatsapp, site.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper/70 transition-colors hover:text-paper"
                  >
                    WhatsApp
                  </a>
                </li>
                {settings.linkedin && (
                  <li>
                    <a
                      href={settings.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper/70 transition-colors hover:text-paper"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
                {settings.gbpUrl && (
                  <li>
                    <a
                      href={settings.gbpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper/70 transition-colors hover:text-paper"
                    >
                      Google Maps
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3 border-t border-paper/10 py-7 text-xs text-paper/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <p className="max-w-prose leading-relaxed sm:text-right">
            {settings.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
