/** Spice dots — ●●○, never emoji. */
export function SpiceDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="text-[0.8rem] tracking-[1px]" title={`Spice level ${level} of 3`}>
      <span className="sr-only">{`Spice level ${level} of 3`}</span>
      <span aria-hidden="true" className="text-spice">
        {"●".repeat(level)}
      </span>
      <span aria-hidden="true" className="text-[color-mix(in_srgb,var(--spice)_25%,transparent)]">
        {"●".repeat(3 - level)}
      </span>
    </span>
  );
}
