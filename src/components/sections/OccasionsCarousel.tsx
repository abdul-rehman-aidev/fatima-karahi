"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OccasionCard } from "@/components/ds/OccasionCard";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/lib/cx";
import type { Occasion } from "@/data/catering";
import type { SitePhotoPool } from "@/sanity/types";

/**
 * Catering page's "Occasions" showcase — a snap-scroll rail at every
 * breakpoint (same mechanics as SpecialsCarousel's "Must Try" rail): mobile
 * gets a single peeking card driven by swipe, sm widens to a two-up peek,
 * and lg locks to an exact 3-up row with prev/next arrows layered on top.
 * One structure for all sizes — card width is just a responsive Tailwind
 * class — so there's no JS media-query branch and no flash of the wrong
 * layout on first paint (the bug that bit CateringGallery's desktop/mobile
 * split under static export).
 */
export function OccasionsCarousel({
  occasions,
  photoPool,
}: {
  occasions: Occasion[];
  photoPool: SitePhotoPool;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // The dot (and the arrows' disabled state) should track whichever card
    // is snapped to the leading (left) edge — "nearest to centre" ties
    // whenever more than one card is simultaneously visible.
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

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === occasions.length - 1;

  return (
    <Reveal>
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-label="Occasions"
          className="flex snap-x snap-mandatory gap-s4 overflow-x-auto pb-2 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {occasions.map((o, i) => (
            <div
              key={o.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${occasions.length}`}
              className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-2*var(--s-4))/3)]"
            >
              <OccasionCard
                name={o.name}
                urdu={o.urdu}
                image={photoPool[o.image]?.image}
                alt={o.name}
                height="lg"
              />
              <p className="mt-s3 max-w-[38ch] text-[0.9rem] leading-[1.6] text-sage">{o.line}</p>
            </div>
          ))}
        </div>

        {/* Arrows are a desktop affordance only — below lg the rail is
            swipe-driven (touch), same as every other rail on the site. */}
        <ArrowButton
          direction="prev"
          disabled={atStart}
          onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
          className="left-s3"
        />
        <ArrowButton
          direction="next"
          disabled={atEnd}
          onClick={() => scrollToIndex(Math.min(activeIndex + 1, occasions.length - 1))}
          className="right-s3"
        />
      </div>

      <div className="mt-s6 flex items-center justify-center gap-[10px]" role="tablist" aria-label="Slides">
        {occasions.map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Show ${o.name}`}
            onClick={() => scrollToIndex(i)}
            className={cx(
              "h-[7px] rounded-pill border border-ivory/40 transition-[width,background-color] duration-[var(--dur)] ease-[var(--ease-soft)]",
              i === activeIndex ? "w-[22px] bg-gold" : "w-[7px] bg-transparent",
            )}
          />
        ))}
      </div>
    </Reveal>
  );
}

/**
 * Sits over the card photos, vertically centred on the image itself (a
 * constant 340px tall — OccasionCard's `height="lg"` sm: size, which is
 * already in effect everywhere these arrows can appear: `hidden lg:grid`
 * keeps them out of the DOM's visible flow below the `lg` breakpoint, and
 * `lg` is well past the `sm` breakpoint where the 340px height kicks in).
 * Same "icon floating over photography" treatment as CateringGallery's
 * expand button: translucent dark fill + ivory hairline at rest, solid gold
 * on hover, so it reads over any photo regardless of brightness.
 */
function ArrowButton({
  direction,
  onClick,
  disabled,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous occasion" : "Next occasion"}
      className={cx(
        "absolute top-[170px] z-[1] hidden h-[42px] w-[42px] -translate-y-1/2 cursor-pointer place-items-center rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_55%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_55%,transparent)] text-ivory backdrop-blur-[2px] transition-[transform,border-color,color,background-color,opacity] duration-[var(--dur)] ease-[var(--ease-soft)] hover:border-transparent hover:bg-gold hover:text-ink hover:shadow-glow-gold hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)] disabled:cursor-not-allowed disabled:opacity-60 lg:grid",
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {direction === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
