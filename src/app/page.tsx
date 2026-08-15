import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { SpecialsCarousel } from "@/components/sections/SpecialsCarousel";
import { ParallaxStatement } from "@/components/sections/ParallaxStatement";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { StoryBand } from "@/components/sections/StoryBand";
import { CateringSpotlight } from "@/components/sections/CateringSpotlight";
import { TrustBand } from "@/components/sections/TrustBand";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <SpecialsCarousel />
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
