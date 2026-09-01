import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SanityPicture } from "@/components/media/SanityPicture";
import { Reveal } from "@/components/motion/Reveal";
import type { SanityImageRef } from "@/sanity/types";

/**
 * Small "about us" teaser between ParallaxStatement and StoryBand — an
 * ivory zone deliberately breaks up what would otherwise be three
 * consecutive dark sections in a row (Parallax → Story → Catering),
 * restoring the site's two-zone dark/light rhythm rather than working
 * against it.
 */
export function AboutTeaser({ image }: { image: SanityImageRef | undefined }) {
  return (
    <section className="bg-cream py-section text-ink">
      <div className="mx-auto grid max-w-content items-center gap-s7 px-[clamp(20px,5vw,56px)] lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="relative h-[240px] overflow-hidden rounded-card shadow-card sm:h-[300px]">
          {image?.asset && (
            <SanityPicture
              image={image}
              alt="Fatima Karahi dining room and table spread"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          )}
        </Reveal>

        <Reveal delay={100}>
          <Eyebrow tone="stone">Restaurant Life</Eyebrow>
          <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ink">
            About Fatima Karahi
          </h2>
          <p className="max-w-[48ch] text-body-l text-stone">
            Fatima Karahi is a modern Pakistani kitchen where bold flavors, rich family
            traditions, and genuine hospitality come together. Every dish is inspired by
            generations of family recipes and Pakistan&rsquo;s vibrant culinary heritage, made
            with quality ingredients and handcrafted with purpose. Because at Fatima Karahi, the
            best meals aren&rsquo;t just served, they&rsquo;re shared.
          </p>
          <div className="mt-s6">
            <Button variant="secondary" href="/about">
              About us →
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
