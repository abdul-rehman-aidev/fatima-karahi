import Image from "next/image";
import { cx } from "@/lib/cx";
import { urlFor } from "@/sanity/image";
import type { SanityImageRef } from "@/sanity/types";

/**
 * Sanity-CDN-backed equivalent of media/Picture.tsx, used only for the
 * Menu section photos and Gallery photos (both Sanity-managed). Every other
 * image on the site keeps using the local pre-generated pipeline via
 * Picture.tsx — this component is not a replacement for it.
 *
 * Always used inside a `relative` container with a fixed aspect ratio or
 * grid span (matching Picture's `className="absolute inset-0"` convention),
 * so `fill` needs no explicit width/height for CLS.
 */
type SanityPictureProps = {
  image: SanityImageRef;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

export function SanityPicture({
  image,
  alt,
  sizes,
  priority = false,
  className,
  imgClassName,
}: SanityPictureProps) {
  if (!image.asset) return null;

  const src = urlFor(image).width(2000).auto("format").url();
  const lqip = image.asset.metadata?.lqip;

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
