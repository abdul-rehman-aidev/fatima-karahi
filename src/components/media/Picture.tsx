import { cx } from "@/lib/cx";

/**
 * Responsive <picture> over the pre-generated AVIF/WebP/JPEG variants
 * (scripts/optimize-images.mjs). Explicit width/height everywhere for CLS;
 * lazy below the fold; `priority` for the hero (eager + fetchpriority=high).
 */
type PictureProps = {
  /** base name in public/img, e.g. "food-karahi" */
  name: string;
  alt: string;
  /** must match the widths generated for this name */
  widths: number[];
  sizes: string;
  /** intrinsic dimensions of the source (aspect ratio + CLS) */
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

export function Picture({
  name,
  alt,
  widths,
  sizes,
  width,
  height,
  priority = false,
  className,
  imgClassName,
}: PictureProps) {
  const srcSet = (ext: string) =>
    widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");
  const largest = widths[widths.length - 1];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/img/${name}-${largest}.jpg`}
        srcSet={srcSet("jpg")}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cx("block", imgClassName)}
      />
    </picture>
  );
}
