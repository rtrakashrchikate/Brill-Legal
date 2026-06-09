import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow media served from the headless WordPress CMS subdomain.
    remotePatterns: [
      { protocol: "https", hostname: "cms.brilllegal.in" },
      { protocol: "https", hostname: "*.wp.com" },
    ],
  },
};

export default nextConfig;
