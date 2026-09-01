import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-rendered (not `output: "export"`) so Sanity's Live Content API,
  // Draft Mode, and Visual Editing can work — see src/sanity/. Every image on
  // the site is Sanity-managed and rendered via next/image through
  // SanityPicture.tsx, which needs cdn.sanity.io allowed below.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  trailingSlash: true,
};

export default nextConfig;
