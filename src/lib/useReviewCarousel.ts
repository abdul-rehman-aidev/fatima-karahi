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
 */
export function useReviewCarousel(count: number) {
  const [active, setActive] = useState(0);
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
