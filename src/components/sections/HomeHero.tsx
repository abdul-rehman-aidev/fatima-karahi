import { Button } from "@/components/ds/Button";
import { HalalBadge } from "@/components/ds/HalalBadge";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { hasOrderUrl, site } from "@/data/site";
import type { SitePhotoPool } from "@/sanity/types";

// SEO audit Medium #8: all four slides shared one identical, generic alt
// string ("Fatima Karahi dining room and table spread") — none of them
// actually show a dining room. Each is now described from the real photo.
const HERO_IMAGES = [
  { key: "hero-carousel-1", alt: "Beef karahi simmering in a cast-iron pan, garnished with coriander and green chilies" },
  { key: "hero-carousel-2", alt: "Whole roasted lamb leg served over spiced Pakistani rice with almonds and raisins" },
  { key: "hero-carousel-3", alt: "Charcoal-grilled tandoori chicken and seekh kebabs fresh off the grill" },
  { key: "hero-carousel-4", alt: "Chicken tikka boti served over fragrant Pakistani rice" },
];

/**
 * The home signature moment: full-bleed crossfade carousel behind a static,
 * vertically-centered content block. The 4-corner vignette is its own layer
 * (doesn't fade with the images) so text contrast holds regardless of which
 * photo is showing.
 */
export function HomeHero({ photoPool }: { photoPool: SitePhotoPool }) {
  const orderHref = hasOrderUrl() ? site.orderUrl : "/order";
  const orderExternal = hasOrderUrl();

  const heroImages = HERO_IMAGES.flatMap((h) => {
    const image = photoPool[h.key]?.image;
    return image?.asset ? [{ key: h.key, alt: h.alt, image }] : [];
  });

  return (
    <section className="relative grid min-h-[100svh] items-center overflow-hidden bg-emerald">
      <HeroCarousel images={heroImages} />

      {/* Darkening overlay — static, weighted toward the bottom two-thirds
          where the body copy, tagline row, and buttons sit */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.50) 70%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* Spotlight — extra darkening centred directly behind the text block */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(ellipse 900px 700px at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Four-corner vignette — static, sits above every slide, below content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: `
            radial-gradient(ellipse 65% 65% at 0% 0%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
            radial-gradient(ellipse 65% 65% at 100% 0%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
            radial-gradient(ellipse 65% 65% at 0% 100%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
            radial-gradient(ellipse 65% 65% at 100% 100%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
            radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)
          `,
        }}
      />

      <div
        className="hero-seq relative z-[5] mx-auto flex w-full max-w-[760px] flex-col items-center px-[clamp(20px,5vw,56px)] py-s8 text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]"
      >
        <p
          data-seq="1"
          className="mb-s1 mt-s5 font-script text-[clamp(3rem,7.5vw,5.1rem)] leading-[1.6] text-gold-bright"
        >
          Fatima Karahi
        </p>
        <h1
          data-seq="2"
          className="m-0 font-display text-display-xl font-normal tracking-[0.01em] text-ivory [text-shadow:0_4px_16px_rgba(0,0,0,0.65)]"
        >
          Flavours <em className="italic text-gold-bright">straight</em> from Pakistan.
        </h1>
        <p data-seq="3" className="mt-s5 max-w-[46ch] text-body-l text-ivory">
          The taste of Pakistan, now in Edmonton: slow-cooked karahi, charcoal BBQ, and the
          warmth of a Pakistani <i>dastarkhwan</i>.
        </p>
        <div data-seq="4" className="mt-s6 flex flex-wrap justify-center gap-s4">
          <Button variant="scrim" size="lg" href="/catering#quote">
            Request a catering quote
          </Button>
          <Button variant="scrim" size="lg" href={orderHref} external={orderExternal}>
            Order online
          </Button>
        </div>
        <ul
          data-seq="5"
          className="mt-s6 flex flex-wrap items-center justify-center gap-x-s5 gap-y-s2 text-eyebrow font-semibold uppercase tracking-[0.1em] text-sage"
        >
          {/* SEO audit Medium #12: the badge previously stood alone with no
              visible text — "Halal" only existed in its alt attribute, so
              sighted users saw an unlabeled icon while competitors state
              "100% Halal-Certified" outright. */}
          <li className="flex items-center gap-s2">
            <HalalBadge size={35} />
            100% Halal-Certified
          </li>
          <li aria-hidden="true" className="text-emerald-line">·</li>
          <li>Serving Edmonton</li>
          <li aria-hidden="true" className="text-emerald-line">·</li>
          <li>Authentic Pakistani recipes</li>
        </ul>
      </div>
    </section>
  );
}
