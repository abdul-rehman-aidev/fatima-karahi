import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Tag — small pill label for menu/feature metadata (e.g. "Chef's Special",
 * "Vegetarian").
 *  - sage: the brand's badge colour — subtle sage-tag tint fill, never a
 *    solid block. Use this for the vast majority of badges.
 *  - outline: neutral on dark
 *  - spice: warm brown-accented, for heat/spice-adjacent callouts on dark
 *  - light: gold-tinted for ivory zones (AA text via --saffron-deep) — reserve
 *    for a genuine gold moment (e.g. "Award-winning"), not everyday badges
 *  - gold: solid gold fill — avoid; kept only for API back-compat, prefer
 *    `light` or `sage` since brand rule is "gold is a highlight, never a fill"
 */
const tones = {
  sage: "bg-[color-mix(in_srgb,var(--sage-tag)_16%,transparent)] text-ink border-[color-mix(in_srgb,var(--sage-tag)_45%,transparent)]",
  outline: "bg-transparent text-sage border-emerald-line",
  spice:
    "bg-[color-mix(in_srgb,var(--spice)_16%,transparent)] text-spice-soft border-[color-mix(in_srgb,var(--spice)_40%,transparent)]",
  light:
    "bg-[color-mix(in_srgb,var(--saffron)_16%,transparent)] text-gold-deep border-[color-mix(in_srgb,var(--saffron)_36%,transparent)]",
  gold: "bg-gold text-ink border-transparent",
};

export function Tag({
  children,
  tone = "outline",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-[6px] rounded-pill border px-[10px] py-s1 font-body text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
