import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

/**
 * Loads GA4 (gtag) when NEXT_PUBLIC_GA_ID is set. Conversion events are sent
 * via lib/analytics `track()` from the contact dock, CTA bands and form.
 */
export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
