import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutHero";
import { AboutStory } from "@/components/sections/AboutStory";
import { AboutVideoBanner } from "@/components/sections/AboutVideoBanner";
import { AboutTestimonials } from "@/components/sections/AboutTestimonials";
import { FounderSection } from "@/components/sections/FounderSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { BreadcrumbJsonLd } from "@/components/chrome/JsonLd";
import { sanityFetch } from "@/sanity/live";
import { SITE_PHOTOS_QUERY } from "@/sanity/queries";
import { buildSitePhotoPool } from "@/sanity/types";

export const metadata: Metadata = {
  title: "About us: the story behind Fatima Karahi",
  description:
    "Halal Pakistani food in Edmonton, cooked fresh, never frozen. The story behind Fatima Karahi's karahi, kebabs, and 4.3-star reputation.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: SITE_PHOTOS_QUERY });
  const photoPool = buildSitePhotoPool(data?.photos);

  return (
    <>
      <AboutHero photoPool={photoPool} />
      <AboutStory photoPool={photoPool} />
      <AboutVideoBanner image={photoPool["food-karahi"]?.image} />
      <AboutTestimonials />
      <FounderSection image={photoPool["founder"]?.image} />
      <TeamSection />
      <BreadcrumbJsonLd name="About" path="/about/" />
    </>
  );
}
