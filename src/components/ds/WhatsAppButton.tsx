import { cx } from "@/lib/cx";
import { waHref } from "@/data/site";

/** The one third-party glyph in the brand — always gold, because it's an action. */
export function WhatsAppGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.2.85 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.47-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.04 8.04 0 0 1-1.24-4.27c0-4.48 3.65-8.12 8.12-8.12Zm-2.13 4.36c-.16-.36-.33-.37-.48-.37l-.41-.01c-.14 0-.37.05-.57.27-.2.22-.75.74-.75 1.8s.77 2.09.88 2.23c.11.15 1.49 2.39 3.69 3.26 1.83.72 2.2.58 2.6.54.39-.04 1.27-.52 1.45-1.02.18-.5.18-.92.13-1.01-.05-.09-.2-.15-.41-.26-.22-.11-1.27-.63-1.47-.7-.2-.07-.34-.11-.48.11-.14.22-.55.7-.68.84-.12.15-.25.16-.46.05-.22-.11-.92-.34-1.76-1.08-.65-.58-1.09-1.3-1.22-1.51-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.38.11-.13.14-.22.22-.37.07-.15.04-.28-.02-.39-.05-.11-.48-1.2-.66-1.64Z" />
    </svg>
  );
}

/**
 * WhatsAppButton — persistent WhatsApp action, key for this community.
 * Pill with label, sits beside form CTAs — a thin gold-bordered treatment,
 * not a fill, so gold stays appropriate here. Pass `tone` to match the zone
 * it's placed in: "light" for emerald/dark zones (bright gold, AA 7:1+),
 * "dark" for ivory/cream zones (gold-deep, AA 4.5:1+) — raw saffron text on
 * ivory only hits 1.7:1 and fails AA, so this is required, not cosmetic.
 */
export function WhatsAppButton({
  tone = "light",
  label = "WhatsApp us",
  className,
}: {
  tone?: "light" | "dark";
  label?: string;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <a
      href={waHref()}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex items-center gap-[10px] rounded-pill border px-[22px] py-s3 font-body text-[0.9375rem] font-semibold no-underline transition-colors duration-[var(--dur)] ease-[var(--ease-soft)]",
        light
          ? "border-[color-mix(in_srgb,var(--saffron)_45%,transparent)] text-gold hover:border-gold hover:text-gold-bright"
          : "border-[color-mix(in_srgb,var(--saffron-deep)_45%,transparent)] text-gold-deep hover:border-gold-deep hover:text-ink",
        className,
      )}
    >
      <WhatsAppGlyph />
      {label}
    </a>
  );
}
