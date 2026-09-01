import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SanityPicture } from "@/components/media/SanityPicture";
import { Reveal } from "@/components/motion/Reveal";
import type { SanityImageRef } from "@/sanity/types";

/** Lahore → Calgary → Edmonton — a large pull-quote band, not a text block. */
export function StoryBand({ image }: { image: SanityImageRef | undefined }) {
  return (
    <section className="relative overflow-hidden bg-emerald-deep py-section">
      <div aria-hidden="true" className="jali absolute inset-0" />
      <div className="relative mx-auto grid max-w-content items-center gap-s8 px-[clamp(20px,5vw,56px)] lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Eyebrow>Lahore → Edmonton</Eyebrow>
          <blockquote className="m-0">
            <p className="mb-s5 mt-s5 font-editorial text-[clamp(1.5rem,2.6vw,2.25rem)] italic font-normal leading-[1.35] text-ivory">
              We brought the same cast-iron karahi, the same hand-ground spice, and the same
              open-hearted hospitality from Lahore, for your table, and for your{" "}
              <em className="text-gold-bright">daawat</em>.
            </p>
          </blockquote>
          <p className="max-w-[52ch] text-body text-sage">
            Fatima Karahi began in the kitchens of Lahore and grew up in Calgary. Now we&rsquo;ve
            brought those same recipes to Edmonton, cooked slow, served generous.
          </p>
          <div className="mt-s6">
            <Button variant="outline" href="/catering">
              Our story &amp; catering →
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative h-[300px] overflow-hidden rounded-card shadow-lift sm:h-[420px]">
          {image?.asset && (
            <SanityPicture
              image={image}
              alt="A full Lahori dastarkhwan laid for a daawat"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          )}
        </Reveal>
      </div>
    </section>
  );
}
