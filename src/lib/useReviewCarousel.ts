"use client";

import { useEffect, useRef, useState } from "react";

const FADE_MS = 560;
const AUTO_ADVANCE_MS = 6000;

/**
 * Shared crossfade-carousel behaviour for the homepage (ReviewsReservation)
 * and About page testimonial sections — same 3 reviews, same timing, same
 * prefers-reduced-motion handling. Extracted after both needed the identical
 * fade-then-swap + pause-on-hover + auto-advance logic, so a future timing
 * tweak can't drift out of sync between the two.
 *
 * `startIndex` (SEO audit Medium #7): both call sites used to hardcode
 * `useState(0)`, so the statically-exported HTML for Home and About baked
 * in the exact same first-rendered testimonial (Meju Ajmeri's) before any
 * client JS ran — the "only one testimonial reused verbatim" finding.
 * Passing a different `startIndex` per page keeps all 3 real reviews in the
 * same rotation everywhere but varies which one is in the initial/static
 * markup for each page.
 */
export function useReviewCarousel(count: number, startIndex = 0) {
  const [active, setActive] = useState(startIndex);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    },
    [],
  );

  const goTo = (i: number) => {
    if (i === active || fading) return;
    if (reduceMotion.current) {
      setActive(i);
      return;
    }
    setFading(true);
    fadeTimer.current = setTimeout(() => {
      setActive(i);
      setFading(false);
    }, FADE_MS);
  };

  useEffect(() => {
    if (reduceMotion.current || paused) return;
    const t = setInterval(() => goTo((active + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active, count]);

  return { active, fading, paused, setPaused, goTo };
}
