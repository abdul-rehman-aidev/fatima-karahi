"use client";

import { useCallback, useEffect, useState } from "react";
import { SanityPicture } from "@/components/media/SanityPicture";
import { cx } from "@/lib/cx";
import type { SanityImageRef } from "@/sanity/types";

export type HeroCarouselImage = { key: string; alt: string; image: SanityImageRef };

// Keep in sync with --hero-display-duration / --hero-transition-duration in
// globals.css (kept as plain numbers here since the interval that drives the
// crossfade has to run in JS, not CSS).
const DISPLAY_MS = 5500;
const TRANSITION_MS = 1800;
const REDUCED_TRANSITION_MS = 300;

/**
 * Full-bleed crossfade background for the hero. All slides are stacked
 * absolutely and only ever animate `opacity` — never position — so a slide
 * fading in and the previous one fading out sum to a constant 1 at every
 * point in the transition (same duration + easing on both), which is what
 * rules out any black-flash. The Ken Burns drift runs only on the active
 * slide and is remounted (via `key`) each time a slide becomes active again,
 * so it always restarts from scale(1).
 */
export function HeroCarousel({ images }: { images: HeroCarouselImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setCycle((c) => c + 1);
  }, []);

  const transitionMs = reducedMotion ? REDUCED_TRANSITION_MS : TRANSITION_MS;
  const cycleMs = DISPLAY_MS + transitionMs;

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
      setCycle((c) => c + 1);
    }, cycleMs);
    return () => clearInterval(id);
  }, [paused, cycleMs, images.length]);

  return (
    <div
      className="absolute inset-0 z-[1] overflow-hidden"
      style={{ ["--hero-transition-duration" as string]: `${transitionMs}ms` }}
    >
      {images.map((img, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={img.key}
            aria-hidden={!isActive}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity var(--hero-transition-duration) ease-in-out",
              zIndex: isActive ? 1 : 0,
              willChange: "opacity",
            }}
          >
            <div
              key={isActive ? `${i}-${cycle}` : `${i}-idle`}
              className={cx("h-full w-full", isActive && !reducedMotion && "hero-kenburns")}
              style={isActive && !reducedMotion ? { animationDuration: `${cycleMs}ms` } : undefined}
            >
              <SanityPicture
                image={img.image}
                alt={img.alt}
                sizes="100vw"
                priority={i <= 1}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover object-center [filter:brightness(0.88)_saturate(1.05)]"
              />
            </div>
          </div>
        );
      })}

      {images.length > 1 && (
        <div
          role="tablist"
          aria-label="Hero images"
          className="absolute inset-x-0 bottom-[clamp(20px,4vh,44px)] z-[3] flex items-center justify-center gap-[10px]"
        >
          {images.map((img, i) => (
            <button
              key={img.key}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => i !== activeIndex && goTo(i)}
              className={cx(
                "h-[7px] rounded-pill border border-ivory/60 transition-[width,background-color] duration-300 ease-out",
                i === activeIndex ? "w-[22px] bg-ivory" : "w-[7px] bg-ivory/25 hover:bg-ivory/55",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
