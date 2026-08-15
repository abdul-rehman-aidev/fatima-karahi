/**
 * Halal certification seal (source: Halal_logo.svg, project root) — used
 * as-is, unmodified colors, everywhere. Replaces the plain word "Halal" in
 * running trust copy, so `alt` matches that word exactly (screen readers
 * hear the same content the surrounding text already gives them).
 */
export function HalalBadge({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/icons/halal-badge.svg"
      width={size}
      height={size}
      alt="Halal"
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
