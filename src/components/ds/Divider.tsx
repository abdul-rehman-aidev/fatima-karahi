import { cx } from "@/lib/cx";

/**
 * Divider — the calligraphic section divider: gold hairline with the small
 * karahi centre-mark (design/assets/divider-karahi.svg, inlined for
 * currentColor). Replaces every generic <hr>.
 */
export function Divider({
  width = 180,
  tone = "gold",
  className,
}: {
  width?: number;
  tone?: "gold" | "line";
  className?: string;
}) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={cx(
        "flex justify-center",
        tone === "gold" ? "text-gold" : "text-emerald-line",
        className,
      )}
    >
      <svg
        viewBox="0 0 120 24"
        width={width}
        height={Math.round((width / 120) * 24)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <line x1="0" y1="12" x2="44" y2="12" />
        <line x1="76" y1="12" x2="120" y2="12" />
        <g transform="translate(50,4)" strokeWidth="1.6">
          <path d="M3 6 H17 C17 6, 15 15, 10 15 C5 15, 3 6, 3 6 Z" />
          <path d="M0 6 H20" />
          <path d="M1 6 C-2 5, -3 8, -1 10" />
          <path d="M19 6 C22 5, 23 8, 21 10" />
        </g>
      </svg>
    </div>
  );
}
