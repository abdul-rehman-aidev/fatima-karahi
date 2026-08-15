import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * Logotype — the real client-supplied logo (public/brand/fatima-logo.png),
 * replacing the earlier placeholder lockup this component used to build out
 * of BrandMark + separately-typeset Urdu/Latin text. The artwork is white,
 * so — like the placeholder it replaces — this only reads correctly on
 * dark (emerald) zones; every current call site (nav, mobile menu, footer)
 * is already one. Natural ratio is 573:436.
 */
const NATURAL_RATIO = 573 / 436;
const HEIGHTS = { sm: 44, md: 92 };

export function Logotype({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const height = HEIGHTS[size];
  return (
    <Link href="/" className={cx("inline-flex items-center no-underline", className)}>
      <img
        src="/brand/fatima-logo.png"
        alt="Fatima Karahi: Authentic Pakistani Cuisine"
        width={Math.round(height * NATURAL_RATIO)}
        height={height}
        className="block h-auto"
        style={{ height }}
      />
    </Link>
  );
}
