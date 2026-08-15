"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OccasionCard } from "@/components/ds/OccasionCard";
import { Reveal } from "@/components/motion/Reveal";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cx } from "@/lib/cx";
import type { Occasion } from "@/data/catering";

/**
 * Catering page's "Occasions" showcase. 5 cards in a 3-column grid left a
 * lopsided 3-then-2 last row on desktop, so desktop (≥1024px) becomes a
 * snap-scroll rail with dots instead — same scroll-tracking mechanics as
 * SpecialsCarousel's "Must Try" rail. Mobile/tablet are untouched: still the
 * plain stacked/2-up grid, which reads fine at those widths and needs no
 * carousel JS.
 */
export function OccasionsCarousel({ occasions }: { occasions: Occasion[] }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <DesktopCarousel occasions={occasions} /> : <MobileGrid occasions={occasions} />;
}

function MobileGrid({ occasions }: { occasions: Occasion[] }) {
  return (
    <div className="grid grid-cols-1 gap-s4 sm:grid-cols-2">
      {occasions.map((o, i) => (
        <Reveal key={o.id} delay={i * 60}>
          <OccasionCard name={o.name} urdu={o.urdu} image={o.image} alt={o.name} height="lg" />
          <p className="mt-s3 max-w-[38ch] text-[0.9rem] leading-[1.6] text-sage">{o.line}</p>
        </Reveal>
      ))}
    </div>
  );
}

function DesktopCarousel({ occasions }: { occasions: Occasion[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
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
              className="w-[calc((100%-2*var(--s-4))/3)] shrink-0 snap-start"
            >
              <OccasionCard name={o.name} urdu={o.urdu} image={o.image} alt={o.name} height="lg" />
              <p className="mt-s3 max-w-[38ch] text-[0.9rem] leading-[1.6] text-sage">{o.line}</p>
            </div>
          ))}
        </div>

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
 * constant 340px tall here — OccasionCard's `height="lg"` sm: size, and this
 * component only ever mounts at ≥1024px so that breakpoint always applies).
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
        "absolute top-[170px] z-[1] grid h-[42px] w-[42px] -translate-y-1/2 cursor-pointer place-items-center rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_55%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_55%,transparent)] text-ivory backdrop-blur-[2px] transition-[transform,border-color,color,background-color,opacity] duration-[var(--dur)] ease-[var(--ease-soft)] hover:border-transparent hover:bg-gold hover:text-ink hover:shadow-glow-gold hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {direction === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
