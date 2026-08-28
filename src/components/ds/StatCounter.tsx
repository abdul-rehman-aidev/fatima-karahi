"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

/**
 * StatCounter — count-up numeral for trust stats. Fraunces, gold.
 * Animates once on first scroll-in; under prefers-reduced-motion (or before
 * hydration) it shows the final value.
 *
 * `variant="dark"` (default, unchanged) is raw --gold/--sage, correct only
 * on dark zones like TrustBand's bg-emerald — both fail contrast on a light
 * background (raw gold is 1.7:1 on cream, and --sage is documented
 * dark-zone-only in globals.css). `variant="light"` swaps in --gold-deep/
 * --stone, the tokens the rest of the site already uses for this exact
 * light-vs-dark-zone problem (see Button, Field, FAQSection).
 */
export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 1400,
  variant = "dark",
}: {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  variant?: "light" | "dark";
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
      <div
        className={cx(
          "font-display text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none",
          variant === "light" ? "text-gold-deep" : "text-gold",
        )}
      >
        {n.toLocaleString()}
        {suffix}
      </div>
      <div
        className={cx(
          "mt-[10px] font-body text-eyebrow font-semibold uppercase tracking-[0.14em]",
          variant === "light" ? "text-stone" : "text-sage",
        )}
      >
        {label}
      </div>
    </div>
  );
}
