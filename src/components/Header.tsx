"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

const nav = [
  { href: "/practices", label: "Practices" },
  { href: "/insights", label: "Insights" },
  { href: "/people", label: "People" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/about", label: "About" },
];

export function Header({
  firmName = "Brill Legal",
  phone,
}: {
  firmName?: string;
  phone?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const phoneLabel = phone ?? site.contact.phone;
  const phoneDigits = (phone ?? site.contact.phone).replace(/[^\d]/g, "") || site.contact.phoneDigits;
  const words = firmName.trim().split(" ");
  const lead = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/"
          className="group flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            {lead ? `${lead} ` : ""}
            <span className="text-accent-deep">{tail}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-sm transition-colors hover:text-accent-deep ${
                  active ? "text-accent-deep" : "text-ink"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-[2px] bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            Request a Consultation
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-base text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-[2px] bg-ink px-4 py-3 text-center text-sm font-medium text-paper"
            >
              Request a Consultation
            </Link>
            <a
              href={`tel:+${phoneDigits}`}
              className="mt-2 text-center text-sm text-muted"
            >
              Call {phoneLabel}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
