"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Picture } from "@/components/media/Picture";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/lib/cx";
import { menu, type Dish } from "@/data/menu";

/**
 * "Must Try" showcase — a curated 5-dish rail (not "whatever happens to be
 * signature" — an explicit, ordered pick). Cards are a fixed width, so five
 * of them overflow the row even on desktop — that's what the dots below
 * are for.
 *
 * Photos are per menu SECTION now, not per dish (see data/menu.ts), so each
 * pick below is deliberately from a different category — otherwise two
 * cards could end up showing the exact same photo. Each pick also needs a
 * single `price` (not `priceTiers`): every dish in Chicken/Lamb/Goat Karahi
 * is weight-tiered, so none of those categories can be used here without
 * also redesigning the card's price display.
 *
 * Colour note: the brief for this section suggested #1A1A1A card panels and
 * a #7FA672 price accent. Both are outside the site's approved six-colour
 * palette (and #1A1A1A reads as nearly pure black, which that same palette
 * explicitly rules out). Substituted the equivalent, already-approved,
 * already-contrast-verified tokens that serve the same role: --emerald-deep
 * for the dark panel, --saffron for the price.
 */
const MUST_TRY_NAMES = ["Beef Nehari", "Chapli Kebab", "Khoya Kheer", "Chicken Biryani", "Chicken Wings"];

type MustTryDish = Dish & { categoryImage?: string };

function findMustTryDish(name: string): MustTryDish | undefined {
  for (const category of menu) {
    const dish = category.dishes.find((d) => d.name === name);
    if (dish) return { ...dish, categoryImage: category.image };
  }
  return undefined;
}

const dishes: MustTryDish[] = MUST_TRY_NAMES.map(findMustTryDish).filter((d): d is MustTryDish => Boolean(d));

export function SpecialsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // The dot should track whichever card is snapped to the leading (left)
    // edge — "nearest to centre" ties whenever an even count of cards is
    // simultaneously visible, which misidentifies the active card at rest.
    const cards = Array.from(el.children) as HTMLElement[];
    let leading = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft <= el.scrollLeft + 1) leading = i;
    });
    setActiveIndex(leading);
  }, []);

  useEffect(() => {
    updateActive();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      el.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [updateActive]);

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section className="bg-ivory py-section text-ink">
      <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
        <Reveal className="mx-auto mb-[clamp(40px,6vw,64px)] max-w-[560px] text-center">
          <Eyebrow tone="stone" className="justify-center">
            Chef&rsquo;s picks
          </Eyebrow>
          <h2 className="mb-[14px] mt-[18px] font-display text-[clamp(2.125rem,3vw+1.4rem,2.875rem)] font-normal leading-[1.1] text-ink">
            Must Try
          </h2>
          <p className="text-body-l text-stone">
            Five dishes we build the daawat around, the ones regulars order by name. This is
            where our menu of authentic Pakistani cuisine really shows itself: halal meat,
            hand-ground spices, and karahi cooked fresh to order, the same way it&rsquo;s made
            back home. If you&rsquo;re new to Fatima Karahi, start here.
          </p>
          <div className="mt-s6">
            <Button variant="secondary" href="/menu">
              View full menu →
            </Button>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            ref={trackRef}
            role="region"
            aria-label="Must Try dishes"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {dishes.map((dish, i) => (
              <SpecialCard key={dish.name} dish={dish} index={i} total={dishes.length} />
            ))}
          </div>

          <div className="mt-[28px] flex items-center justify-center gap-[10px]" role="tablist" aria-label="Slides">
            {dishes.map((dish, i) => (
              <button
                key={dish.name}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show ${dish.name}`}
                onClick={() => scrollToIndex(i)}
                className={cx(
                  "h-[7px] rounded-pill border border-ink/40 transition-[width,background-color] duration-[var(--dur)] ease-[var(--ease-soft)]",
                  i === activeIndex ? "w-[22px] bg-ink" : "w-[7px] bg-transparent",
                )}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SpecialCard({ dish, index, total }: { dish: MustTryDish; index: number; total: number }) {
  return (
    <figure
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      className="group m-0 w-[82%] shrink-0 snap-start transition-transform duration-[var(--dur)] ease-[var(--ease-soft)] hover:scale-[1.025] sm:w-[46%] lg:w-[267px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-card">
        <Picture
          name={dish.categoryImage!}
          alt={dish.name}
          widths={[480, 828, 1200]}
          sizes="(min-width: 1024px) 267px, (min-width: 640px) 46vw, 82vw"
          width={1200}
          height={1500}
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05]"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-3 rounded-b-card bg-emerald-deep px-[18px] py-[16px] shadow-card transition-shadow duration-[var(--dur)] ease-[var(--ease-soft)] group-hover:shadow-lift">
        <span className="font-body text-[0.95rem] font-medium text-ivory">{dish.name}</span>
        <span className="font-body text-[0.95rem] font-bold text-gold">{dish.price}</span>
      </figcaption>
    </figure>
  );
}
