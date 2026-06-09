import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactDock } from "@/components/ContactDock";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { getSettings } from "@/lib/source/settings";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Indian Law Practice`,
    template: `%s | ${site.name}`,
  },
  description:
    "Brill Legal is a full-service Indian law practice — litigation, white-collar, real estate & RERA, family, arbitration, corporate and tribunal work. Practising since 2007.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Indian Law Practice`,
    description:
      "A full-service Indian law practice — litigation, white-collar, real estate & RERA, family, arbitration, corporate and tribunal work.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <JsonLd data={graph(organizationSchema(settings), websiteSchema())} />
        <Header firmName={settings.name} phone={settings.phone} />
        <main className="flex-1">{children}</main>
        <Footer />
        <ContactDock
          whatsapp={settings.whatsapp}
          phoneDigits={settings.phoneDigits}
        />
        <Analytics />
      </body>
    </html>
  );
}
