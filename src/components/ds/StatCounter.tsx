"use client";

import { useEffect, useRef, useState } from "react";

/**
 * StatCounter — count-up numeral for trust stats. Fraunces, gold.
 * Animates once on first scroll-in; under prefers-reduced-motion (or before
 * hydration) it shows the final value.
 */
export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(value); // SSR/no-JS shows the real number
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setN(0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none text-gold">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-[10px] font-body text-eyebrow font-semibold uppercase tracking-[0.14em] text-sage">
        {label}
      </div>
    </div>
  );
}
