import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static v1 — no server logic. The quote/contact forms post to a
  // pluggable endpoint (see src/lib/forms.ts).
  output: "export",
  // The default optimizer is unavailable with `output: 'export'`; responsive
  // AVIF/WebP variants are pre-generated at build time by scripts/optimize-images.mjs
  // and consumed through components/media/Picture.tsx.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
