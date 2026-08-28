import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * Logotype — the real client-supplied logo (public/brand/fatima-logo.png),
 * replacing the earlier placeholder lockup this component used to build out
 * of BrandMark + separately-typeset Urdu/Latin text. The artwork is white,
 * so — like the placeholder it replaces — this only reads correctly on
 * dark (emerald) zones; every current call site (nav, mobile menu, footer)
 * is already one.
 *
 * SEO/perf fix (AUDIT.md Critical #2): the client's original export was
 * 573×436 (160KB) but only ever displayed at 58×44–121×92 — an oversized,
 * unoptimized PNG that Lighthouse flagged as the homepage's actual LCP
 * element (mobile LCP 8.5s). The master is kept at
 * assets-src/fatima-logo-master.png; public/brand/fatima-logo.png is now a
 * 242×184 (2x retina for the largest "md" use) palette-PNG re-export
 * (~11KB) — re-run the resize in that comment/README if the source art
 * changes. Ratio (573:436) is preserved exactly, so the width/height math
 * below is unaffected.
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
