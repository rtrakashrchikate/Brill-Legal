import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Authenticated surfaces and the write endpoints carry nothing a
        // crawler should index or spend budget on.
        disallow: ["/api/", "/dashboard", "/login"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
