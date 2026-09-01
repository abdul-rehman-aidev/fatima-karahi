import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { SpecialsCarousel } from "@/components/sections/SpecialsCarousel";
import { pickMustTryDishes } from "@/components/sections/mustTryDishes";
import { ParallaxStatement } from "@/components/sections/ParallaxStatement";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { StoryBand } from "@/components/sections/StoryBand";
import { CateringSpotlight } from "@/components/sections/CateringSpotlight";
import { TrustBand } from "@/components/sections/TrustBand";
import { FAQSection } from "@/components/sections/FAQSection";
import { sanityFetch } from "@/sanity/live";
import { CATERING_PACKAGES_QUERY, MENU_QUERY, SITE_PHOTOS_QUERY } from "@/sanity/queries";
import { buildSitePhotoPool } from "@/sanity/types";

export const metadata: Metadata = {
  // SEO audit High #7 — the previous default title (from layout.tsx's
  // `${site.name}: ${site.tagline}`) omitted both "Edmonton" and "halal",
  // the two terms every competitor checked leads with and the ones most
  // likely to be lifted as the canonical entity title by an AI engine.
  // Overriding explicitly here rather than editing the tagline, since that
  // string is also the hero's H1 supporting line and reads fine as-is there.
  // `absolute` bypasses layout.tsx's `%s · Fatima Karahi` template — this
  // string already carries the brand name, so the template would otherwise
  // double it up ("...in Edmonton · Fatima Karahi").
  title: { absolute: "Fatima Karahi: Halal Pakistani Restaurant in Edmonton" },
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [{ data }, { data: sitePhotosData }, { data: packagesData }] = await Promise.all([
    sanityFetch({ query: MENU_QUERY }),
    sanityFetch({ query: SITE_PHOTOS_QUERY }),
    sanityFetch({ query: CATERING_PACKAGES_QUERY }),
  ]);
  const mustTryDishes = pickMustTryDishes(data?.categories ?? []);
  const photoPool = buildSitePhotoPool(sitePhotosData?.photos);
  const cateringPackages = packagesData?.packages ?? [];

  return (
    <>
      <HomeHero photoPool={photoPool} />
      <SpecialsCarousel dishes={mustTryDishes} />
      <ParallaxStatement
        image={photoPool["parallax"]?.image}
        heading="We cater the way we’d host family."
        supportingLine="Setup, service, and the last plate cleared: all handled."
        ctaLabel="Explore catering"
        ctaHref="/catering"
      />
      <AboutTeaser image={photoPool["hero-carousel-4"]?.image} />
      <StoryBand image={photoPool["food-spread"]?.image} />
      <CateringSpotlight photoPool={photoPool} packages={cateringPackages} />
      <TrustBand backgroundImage={photoPool["hero-carousel-1"]?.image} />
      <FAQSection variant="light" />
    </>
  );
}
