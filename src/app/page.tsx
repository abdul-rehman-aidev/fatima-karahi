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
import { MENU_QUERY } from "@/sanity/queries";

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
  const { data } = await sanityFetch({ query: MENU_QUERY });
  const mustTryDishes = pickMustTryDishes(data?.categories ?? []);

  return (
    <>
      <HomeHero />
      <SpecialsCarousel dishes={mustTryDishes} />
      <ParallaxStatement
        image="parallax"
        heading="We cater the way we’d host family."
        supportingLine="Setup, service, and the last plate cleared: all handled."
        ctaLabel="Explore catering"
        ctaHref="/catering"
      />
      <AboutTeaser />
      <StoryBand />
      <CateringSpotlight />
      <TrustBand />
      <FAQSection variant="light" />
    </>
  );
}
