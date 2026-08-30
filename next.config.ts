import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-rendered (not `output: "export"`) so Sanity's Live Content API,
  // Draft Mode, and Visual Editing can work — see src/sanity/. Most images
  // still go through the local pre-generated pipeline (components/media/
  // Picture.tsx, scripts/optimize-images.mjs); only Sanity-managed images
  // (Menu section photos, Gallery) use next/image via SanityPicture.tsx,
  // which needs cdn.sanity.io allowed below.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  trailingSlash: true,
};

export default nextConfig;
