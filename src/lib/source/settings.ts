import { cache } from "react";
import { site } from "@/config/site";
import { wpEnabled, wpFetch } from "@/lib/wp/client";
import { QUERY_SITE_SETTINGS } from "@/lib/wp/queries";
import type { WpSiteSettings } from "@/lib/wp/mappers";

/** Normalised, render-ready site settings (WP-overridable NAP + brand). */
export type Settings = {
  name: string;
  tagline: string;
  phone: string;
  phoneDigits: string;
  whatsapp: string;
  email: string;
  address: string;
  linkedin: string;
  gbpUrl: string;
  footerDisclaimer: string;
  officeHours: string;
};

const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");

const DEFAULT_DISCLAIMER =
  "This website is for general information only and is not legal advice. Use of this site does not create a lawyer–client relationship.";

const localDefaults: Settings = {
  name: site.name,
  tagline: site.tagline,
  phone: site.contact.phone,
  phoneDigits: site.contact.phoneDigits,
  whatsapp: site.contact.whatsapp,
  email: site.contact.email,
  address: `${site.contact.addressLine}, ${site.contact.locality}, ${site.contact.region} ${site.contact.postalCode}`,
  linkedin: site.social.linkedin,
  gbpUrl: "",
  footerDisclaimer: DEFAULT_DISCLAIMER,
  officeHours: "",
};

export const getSettings = cache(async (): Promise<Settings> => {
  if (wpEnabled) {
    const data = await wpFetch<WpSiteSettings>(QUERY_SITE_SETTINGS, {
      tags: ["wp", "wp:settings"],
    });
    const f = data?.siteSettings?.siteSettingsFields;
    if (f) {
      const phone = f.phone || localDefaults.phone;
      return {
        name: f.firmName || localDefaults.name,
        tagline: f.strapline || localDefaults.tagline,
        phone,
        phoneDigits: onlyDigits(phone) || localDefaults.phoneDigits,
        whatsapp: onlyDigits(f.whatsappNumber ?? "") || localDefaults.whatsapp,
        email: f.email || localDefaults.email,
        address: f.officeAddress || localDefaults.address,
        linkedin: f.linkedinUrl || localDefaults.linkedin,
        gbpUrl: f.gbpUrl ?? "",
        footerDisclaimer: f.footerDisclaimer || DEFAULT_DISCLAIMER,
        officeHours: f.officeHours ?? "",
      };
    }
  }
  return localDefaults;
});

export const waLinkFor = (whatsapp: string, message: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

export const telLinkFor = (digits: string) => `tel:+${digits}`;
