import Image from "next/image";
import { cx } from "@/lib/cx";
import { urlFor } from "@/sanity/image";
import type { SanityImageRef } from "@/sanity/types";

/**
 * Sanity-CDN-backed image component, used for every Sanity-managed photo
 * on the site (Menu, Gallery, and the shared Site Photos pool).
 *
 * By default (`fill` true) it's used inside a `relative` container with a
 * fixed aspect ratio or grid span (matching Picture's
 * `className="absolute inset-0"` convention), so `fill` needs no explicit
 * width/height for CLS. Pass `fill={false}` for intrinsic sizing (e.g. a
 * lightbox that shrinks the image to fit its own bounds) — this renders
 * next/image with the Sanity asset's own metadata dimensions instead.
 */
type SanityPictureProps = {
  image: SanityImageRef;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
};

export function SanityPicture({
  image,
  alt,
  sizes,
  priority = false,
  className,
  imgClassName,
  fill = true,
}: SanityPictureProps) {
  if (!image.asset) return null;

  const src = urlFor(image).width(2000).auto("format").url();
  const lqip = image.asset.metadata?.lqip;
  const dimensions = image.asset.metadata?.dimensions;

  if (!fill) {
    if (!dimensions?.width || !dimensions?.height) return null;
    return (
      <Image
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        sizes={sizes}
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip || undefined}
        priority={priority}
        className={cx(className, imgClassName)}
      />
    );
  }

  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip || undefined}
        priority={priority}
        className={cx("object-cover", imgClassName)}
      />
    </div>
  );
}
