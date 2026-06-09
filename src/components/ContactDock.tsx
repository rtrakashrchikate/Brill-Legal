"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";

/**
 * Floating contact dock — sticky on all pages, appears after a little scroll,
 * hides on the contact page. WhatsApp + Call + Request a Consultation, all
 * GA4-tracked. NAP comes from live settings (props), falling back to config.
 */
export function ContactDock({
  whatsapp = site.contact.whatsapp,
  phoneDigits = site.contact.phoneDigits,
}: {
  whatsapp?: string;
  phoneDigits?: string;
}) {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`;
  const telHref = `tel:+${phoneDigits}`;

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto mb-3 flex w-full max-w-md items-stretch gap-2 px-4 sm:max-w-lg">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_whatsapp", { location: "dock" })}
          className="flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-[#1f7a4d] px-3 py-3 text-sm font-medium text-white shadow-lg"
        >
          WhatsApp
        </a>
        <a
          href={telHref}
          onClick={() => track("click_call", { location: "dock" })}
          className="flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-ink-soft px-3 py-3 text-sm font-medium text-paper shadow-lg"
        >
          Call
        </a>
        <a
          href="/contact"
          onClick={() => track("generate_lead", { location: "dock", method: "form_cta" })}
          className="flex flex-[1.4] items-center justify-center gap-2 rounded-[2px] bg-accent px-3 py-3 text-sm font-medium text-white shadow-lg"
        >
          Consultation
        </a>
      </div>
      <span className="sr-only">Contact {site.name}</span>
    </div>
  );
}
