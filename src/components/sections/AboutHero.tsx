import { Divider } from "@/components/ds/Divider";
import { Picture } from "@/components/media/Picture";

const PANELS = [
  { name: "hero-carousel-1", alt: "Fatima Karahi dining room and table spread" },
  { name: "hero-carousel-2", alt: "Fatima Karahi dining room and table spread" },
  { name: "hero-carousel-3", alt: "Fatima Karahi dining room and table spread" },
];

/**
 * About page banner — a 3-panel photo collage (real interior/table-spread
 * photography, the same set HomeHero's carousel uses) under the page title.
 * Mobile drops to the first panel only, per the brief ("a single readable
 * image ... rather than cramming 3 panels edge-to-edge") — a CSS-only
 * `hidden lg:block` cut, not a conditional mount, since all three panels are
 * structurally identical <Picture> cells.
 */
export function AboutHero() {
  return (
    <section className="relative grid min-h-[52svh] overflow-hidden bg-emerald-deep">
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-3">
        {PANELS.map((panel, i) => (
          <div key={panel.name} className={i === 0 ? "relative" : "relative hidden lg:block"}>
            <Picture
              name={panel.name}
              alt={panel.alt}
              widths={i === 0 ? [480, 640, 828, 1200] : [640, 828, 1200]}
              sizes={i === 0 ? "100vw" : "33vw"}
              width={1200}
              height={1500}
              priority={i === 0}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Same flat emerald-deep scrim used across the site for type over
          photography (ParallaxStatement, ReviewsReservation). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--emerald-deep)_58%,transparent)]"
      />

      <div className="relative z-[1] flex min-h-[52svh] flex-col items-center justify-center px-[clamp(20px,5vw,56px)] pt-[84px] text-center">
        <p lang="ur" dir="rtl" className="mb-s2 text-[2rem] leading-[1.5] text-gold-bright">
          ہمارے بارے میں
        </p>
        <h1 className="m-0 font-display text-display-xl font-normal text-ivory">About us</h1>
        <Divider width={140} className="mt-s5" />
      </div>
    </section>
  );
}
