import type { CSSProperties } from "react";
import type { ImageFormat } from "@sanity/image-url";
import { Button } from "@/components/ds/Button";
import { Reveal } from "@/components/motion/Reveal";
import { urlFor } from "@/sanity/image";
import type { SanityImageRef } from "@/sanity/types";

type ParallaxStatementProps = {
  image: SanityImageRef | undefined;
  heading: string;
  supportingLine?: string;
  /** optional internal link to the page this moment is about (e.g. catering) */
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Full-bleed "mood moment" section: a pinned background image under an
 * emerald scrim, one centred heading. A breathing pause between conversion
 * blocks, not a conversion block itself — no cards, and a CTA only when
 * `ctaHref` is passed (this section is often tied to one specific page, e.g.
 * the homepage's catering moment, so it doubles as internal-link surface
 * rather than staying a dead end).
 *
 * The pin is plain CSS `background-attachment: fixed` on the section's own
 * box — nothing else. No wrapper, no extra height, no JS, no scroll
 * listener. Two more elaborate approaches were tried and discarded here:
 * a `scroll` + `transform` listener (three rounds of bugs — wrong sign,
 * wrong magnitude, sub-pixel vibration — because it required hand-computing
 * per-frame math), and a `position: sticky` tall-wrapper trick (introduced
 * a visible gap: the wrapper was made taller than its sticky child to give
 * the pin some scroll duration, but the leftover wrapper space had no
 * content and no background, so it showed through as blank page colour).
 * Both were solving problems `background-attachment: fixed` doesn't have —
 * it paints relative to the viewport within the section's own natural box,
 * so there's no extra invisible space for a gap to hide in, and no script
 * to have a timing/sign/rounding bug in.
 *
 * The one real trade-off: iOS Safari has a history of not honouring fixed
 * attachment reliably. Where it doesn't, this degrades to an ordinary
 * scrolling background — no gap, no jump, no jitter, just no pin — which is
 * a safe failure mode, unlike the alternatives above.
 *
 * CSS background (not <Picture>/<img>) is a deliberate choice: this image
 * is decorative (the copy carries the meaning), so it's `aria-hidden` with
 * no alt text needed. Format fallback (AVIF → WebP → JPEG) is handled by
 * `.parallax-bg` in globals.css via `image-set()`, fed by the three
 * `--parallax-*` custom properties set below, each a Sanity CDN URL for the
 * same 1920x1000 crop in a different format — see that rule's comment.
 */
export function ParallaxStatement({
  image,
  heading,
  supportingLine,
  ctaLabel,
  ctaHref,
}: ParallaxStatementProps) {
  // @sanity/image-url's ImageFormat type predates "avif" support, but the
  // CDN accepts it as an `fm` value regardless — cast past the stale union.
  const crop = (format: "avif" | "webp" | "jpg") =>
    image?.asset
      ? urlFor(image).width(1920).height(1000).fit("crop").format(format as ImageFormat).url()
      : undefined;

  return (
    <section
      className="parallax-bg relative h-[55vh] min-h-[400px] overflow-hidden bg-emerald-deep bg-cover bg-center bg-fixed"
      style={
        {
          "--parallax-avif": crop("avif") ? `url(${crop("avif")})` : undefined,
          "--parallax-webp": crop("webp") ? `url(${crop("webp")})` : undefined,
          "--parallax-jpg": crop("jpg") ? `url(${crop("jpg")})` : undefined,
        } as CSSProperties
      }
    >
      {/* Emerald scrim — the site's standard treatment for type over imagery,
          never flat black. Flat wash (not a corner vignette) is enough here:
          the heading sits dead centre, not near an edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--emerald-deep)_62%,transparent)]"
      />

      <div className="relative z-[1] flex h-full items-center justify-center px-[clamp(20px,5vw,56px)] text-center">
        <Reveal className="max-w-[600px]">
          <div
            aria-hidden="true"
            className="mx-auto mb-s5 h-px w-[64px] bg-[color-mix(in_srgb,var(--saffron)_55%,transparent)]"
          />
          <h2 className="m-0 font-display text-display-l font-normal text-ivory">{heading}</h2>
          {supportingLine && (
            <p className="mx-auto mt-s4 max-w-[46ch] text-body-l text-sage">{supportingLine}</p>
          )}
          {ctaHref && (
            <div className="mt-s6">
              <Button variant="outline" href={ctaHref}>
                {ctaLabel}
              </Button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
