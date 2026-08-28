import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/about/`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/menu/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/catering/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // Was missing entirely (SEO audit Critical #1) — real, indexable,
    // nav-linked page with its own canonical that was silently absent here.
    { url: `${site.url}/gallery/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contact/`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/order/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
