import type { Metadata } from "next";
import { site } from "@/config/site";

/** Build a page Metadata object with a clean canonical and OG tags. */
export function pageMeta(args: {
  title: string;
  description: string;
  path: string; // begins with "/"
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}): Metadata {
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: args.path },
    robots: args.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: args.title,
      description: args.description,
      url: `${site.url}${args.path}`,
      type: args.type ?? "website",
      siteName: site.name,
      ...(args.publishedTime ? { publishedTime: args.publishedTime } : {}),
    },
  };
}
