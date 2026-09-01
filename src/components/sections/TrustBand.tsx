import { Eyebrow } from "@/components/ds/Eyebrow";
import { StatCounter } from "@/components/ds/StatCounter";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewsReservation } from "@/components/sections/ReviewsReservation";
import { site } from "@/data/site";
import type { SanityImageRef } from "@/sanity/types";

/**
 * Trust band — count-up numerals (never icon cards), unchanged. The old
 * single testimonial block that used to sit directly below is now the
 * separate full-bleed ReviewsReservation section (carousel + reservation/
 * contact card) — kept as a sibling, not nested in this section's
 * max-w-content container, since it needs full-bleed width for its photo.
 */
export function TrustBand({ backgroundImage }: { backgroundImage: SanityImageRef | undefined }) {
  return (
    <>
      <section className="border-t-[0.5px] border-emerald-line bg-emerald pt-section pb-[clamp(3rem,6vw,4rem)]">
        <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)] text-center">
          <Reveal>
            <Eyebrow>Why Fatima Karahi</Eyebrow>
          </Reveal>

          <Reveal delay={80} className="mt-s7 grid grid-cols-1 gap-s7 sm:grid-cols-3 sm:gap-s7">
            {site.stats.map((s) => (
              <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </Reveal>
        </div>
      </section>
      <ReviewsReservation backgroundImage={backgroundImage} />
    </>
  );
}
