import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Eyebrow — the tracked-caps section kicker ("From Pakistan to Edmonton").
 * Gold by default; sage over busy imagery; stone on light zones.
 *
 * `size="lg"` is the page-title variant: the hero kicker that names the page
 * itself (Gallery, Catering, Contact, The menu). At the default "sm" size it
 * read too small next to the Urdu title line beside it — bumped to match
 * that line's font size so it's legible as a page name, not a stray dash.
 * Kept as a size variant (not a className override) because `text-eyebrow`
 * and an arbitrary `text-[…]` are both text-size utilities in the same
 * Tailwind layer — whichever one the generator happens to place later in
 * the stylesheet wins, not whichever is passed last here (see Button's
 * border comment for the same gotcha) — so the size has to be chosen via
 * the class list itself, never appended alongside it.
 */
const tones = {
  gold: "text-gold",
  sage: "text-sage",
  stone: "text-stone",
};

const sizes = {
  sm: "text-eyebrow",
  lg: "text-[2.2rem] leading-[1.3] tracking-[0.02em]",
};

const barSizes = {
  sm: "h-px w-s5",
  lg: "h-[2px] w-s6",
};

export function Eyebrow({
  children,
  tone = "gold",
  size = "sm",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-[10px] font-body font-semibold uppercase",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className={cx(barSizes[size], "bg-current opacity-70")} />
      {children}
    </span>
  );
}
