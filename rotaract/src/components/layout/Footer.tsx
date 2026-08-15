import Link from "next/link";

import { Wheel } from "@/components/layout/Navbar";
import { Aurora } from "@/components/ui/Aurora";
import { CopyButton, MailIcon, WhatsAppIcon } from "@/components/ui/CopyButton";
import { navLinks, site } from "@/config/site";

const secondary = [
  { href: "/hub", label: "Post a requirement" },
  { href: "/login", label: "Rotaractor login" },
  { href: "/about#history", label: "Club history" },
  { href: "/about#values", label: "How we work" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-hairline">
      <Aurora variant="soft" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
              <Wheel className="size-10" />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-base font-semibold">{site.shortName}</span>
                <span className="text-[0.68rem] uppercase tracking-[0.2em] text-fg-muted">
                  {site.district} · Chartered {site.chartered}
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-fg-muted">{site.tagline}</p>
            <p className="max-w-xs text-[0.8rem] leading-relaxed text-fg-muted/80">
              {site.address}
            </p>
          </div>

          <nav aria-label="Footer — pages" className="flex flex-col gap-3">
            <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-fg">
              Explore
            </h2>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-fg-muted transition-colors duration-300 hover:text-cranberry-600 dark:hover:text-cranberry-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Footer — members" className="flex flex-col gap-3">
            <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-fg">
              For Rotaractors
            </h2>
            {secondary.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-fg-muted transition-colors duration-300 hover:text-cranberry-600 dark:hover:text-cranberry-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-fg">
              Reach us
            </h2>
            <p className="text-sm text-fg-muted">
              No account needed — copy a detail and write to us directly.
            </p>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={site.email} label={site.email} icon={<MailIcon />} />
              <CopyButton value={site.whatsapp} label={site.whatsapp} icon={<WhatsAppIcon />} />
            </div>
            <div className="mt-2 flex gap-2">
              {Object.entries(site.socials).map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass grid size-9 place-items-center rounded-full text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:text-cranberry-600"
                  aria-label={name}
                >
                  <span className="text-[0.65rem] font-semibold uppercase">{name.slice(0, 2)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 text-[0.78rem] text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Rotaract is a programme of Rotary
            International.
          </p>
          <p className="text-fg-muted/75">
            Reading is always open. Only posting a requirement needs a verified account.
          </p>
        </div>
      </div>
    </footer>
  );
}
