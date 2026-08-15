import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Button — the brand's action.
 *  - primary: emerald fill, cream text, gold fill + ink text on hover —
 *    the one signature CTA per screen ("Reserve a table", "Request a
 *    catering quote"). Gold appears only as the hover highlight, never
 *    the resting fill, per brand rule ("never a large gold fill").
 *  - secondary: brown hairline, transparent fill, ink text; fills to
 *    brown with cream text on hover ("View Menu"-style outline CTA).
 *  - outline: ivory hairline — for dark zones, over emerald imagery
 *    (success states inside a dark card).
 *  - scrim: outline's darker sibling for busy photography (the hero
 *    carousel) — a translucent emerald-deep fill keeps the label readable
 *    against bright/mid-tone image content even before the gold hover fill.
 *  - ghost: text + gold (dark zones) · ghost-light: AA gold on ivory zones
 * Hover scales 1.02 with a soft glow; press settles to 0.98. Shadows stay
 * low-opacity throughout — no heavy drop shadows.
 */
type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "scrim" | "ghost" | "ghost-light";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: MouseEventHandler;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

// No border-width/border-color utility lives here: Tailwind resolves
// same-category utility classes by stylesheet order, not by string position
// in a template literal, so a base "border border-transparent" silently
// beats a later, more specific border override at equal specificity (this
// bit us for real — see the primary variant's comment). Every variant below
// owns its border declaration completely, once, with nothing to conflict with.
const base =
  "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-pill font-body font-semibold leading-none whitespace-nowrap no-underline transition-[transform,background-color,box-shadow,color,border-color] duration-[var(--dur)] ease-[var(--ease-soft)] disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
  lg: "px-s6 py-s4 text-[1.0625rem]",
  md: "px-[26px] py-[13px] text-[0.9375rem]",
  sm: "px-[18px] py-[9px] text-[0.8125rem]",
};

const variants = {
  // A merely-tinted border measured as visually indistinguishable from the
  // hero/footer backdrop (both are dark emerald) — a resting button needs a
  // clearly perceptible edge even before its gold hover state kicks in.
  // 1.5px at 40% ivory + a real dark (not emerald-tinted) drop shadow gives
  // it an unambiguous edge and a sense of lift on any dark zone.
  primary:
    "border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_40%,transparent)] bg-emerald text-ivory shadow-[0_6px_16px_color-mix(in_srgb,var(--ink)_30%,transparent)] hover:border-transparent hover:bg-gold hover:text-ink hover:shadow-glow-gold hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]",
  secondary:
    "border border-brown text-ink hover:bg-brown hover:text-ivory hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]",
  // Transparent outline at rest, fills solid gold on hover — same fill
  // treatment as primary's hover state, just starting from a bordered/
  // transparent rest state instead of an emerald one. Used for secondary
  // "related page" links on dark zones (secondary variant is its light-zone
  // equivalent: brown outline → solid brown fill).
  outline:
    "border border-[color-mix(in_srgb,var(--ivory)_45%,transparent)] text-ivory hover:border-transparent hover:bg-gold hover:text-ink hover:shadow-glow-gold hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]",
  scrim:
    "border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_70%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_45%,transparent)] text-ivory shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-[2px] hover:border-transparent hover:bg-gold hover:text-ink hover:shadow-glow-gold hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]",
  ghost: "px-s2 text-gold hover:text-gold-bright",
  "ghost-light": "px-s2 text-gold-deep hover:text-ink",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external = false,
  type = "button",
  onClick,
  disabled,
  className,
  children,
}: ButtonProps) {
  const cls = cx(base, sizes[size], variants[variant], className);

  if (href && external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
