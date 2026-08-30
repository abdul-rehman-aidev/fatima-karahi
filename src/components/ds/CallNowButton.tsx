import { cx } from "@/lib/cx";
import { site } from "@/data/site";

/** Phone glyph — pairs with CallNowButton, same treatment WhatsAppGlyph used to get. */
export function PhoneGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

/**
 * CallNowButton — persistent "call the restaurant" action. Replaces the
 * former WhatsAppButton: the restaurant has no WhatsApp line, only a phone
 * number, so every spot that offered a WhatsApp pill now dials `tel:`
 * instead (opens the phone app directly, no target/rel needed since it's
 * not a same-tab web navigation). Same pill treatment as before — thin
 * gold-bordered, not a fill. Pass `tone` to match the zone it's placed in:
 * "light" for emerald/dark zones (bright gold, AA 7:1+), "dark" for
 * ivory/cream zones (gold-deep, AA 4.5:1+) — raw saffron text on ivory only
 * hits 1.7:1 and fails AA, so this is required, not cosmetic.
 */
export function CallNowButton({
  tone = "light",
  label = "Call now",
  className,
}: {
  tone?: "light" | "dark";
  label?: string;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <a
      href={site.phoneHref}
      className={cx(
        "inline-flex items-center gap-[10px] rounded-pill border px-[22px] py-s3 font-body text-[0.9375rem] font-semibold no-underline transition-colors duration-[var(--dur)] ease-[var(--ease-soft)]",
        light
          ? "border-[color-mix(in_srgb,var(--saffron)_45%,transparent)] text-gold hover:border-gold hover:text-gold-bright"
          : "border-[color-mix(in_srgb,var(--saffron-deep)_45%,transparent)] text-gold-deep hover:border-gold-deep hover:text-ink",
        className,
      )}
    >
      <PhoneGlyph />
      {label}
    </a>
  );
}
