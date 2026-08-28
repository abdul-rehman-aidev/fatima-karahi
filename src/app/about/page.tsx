import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutHero";
import { AboutStory } from "@/components/sections/AboutStory";
import { AboutVideoBanner } from "@/components/sections/AboutVideoBanner";
import { AboutTestimonials } from "@/components/sections/AboutTestimonials";
import { FounderSection } from "@/components/sections/FounderSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { BreadcrumbJsonLd } from "@/components/chrome/JsonLd";

export const metadata: Metadata = {
  title: "About us: the story behind Fatima Karahi",
  description:
    "Halal Pakistani food in Edmonton, cooked fresh, never frozen. The story behind Fatima Karahi's karahi, kebabs, and 4.3-star reputation.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutVideoBanner />
      <AboutTestimonials />
      <FounderSection />
      <TeamSection />
      <BreadcrumbJsonLd name="About" path="/about/" />
    </>
  );
}
