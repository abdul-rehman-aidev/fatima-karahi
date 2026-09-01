"use client";

import { useEffect, useRef, useState } from "react";
import { SanityPicture } from "@/components/media/SanityPicture";
import { Reveal } from "@/components/motion/Reveal";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cx } from "@/lib/cx";
import type { GalleryTile } from "@/data/catering";
import type { SanityImageRef, SitePhotoPool } from "@/sanity/types";

/**
 * Catering gallery — desktop: one dominant portrait photo (col 1, full grid
 * height) beside a 2x3 checkerboard of pure-photography tiles and dark
 * copy cards (heading + line + "Discover more"). Mobile: a tight two-column
 * photo collage, six images only — no text, no scrims, no lightbox — edge
 * to edge with a small consistent gap, never a scaled-down copy of the
 * desktop grid and never a carousel.
 *
 * The two variants are different structures entirely (data-driven grid-area
 * layout with interactive copy cards vs. a fixed six-image collage), so —
 * same pattern as MenuSection's desktop/accordion split — one subtree is
 * conditionally mounted rather than both rendered and hidden with CSS.
 */
const AREA_NAMES = ["dominant", "t1", "t2", "t3", "t4", "t5", "t6"];

export function CateringGallery({
  tiles,
  photoPool,
}: {
  tiles: GalleryTile[];
  photoPool: SitePhotoPool;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [lightboxTile, setLightboxTile] = useState<GalleryTile | null>(null);

  return (
    <>
      {isDesktop ? (
        <DesktopGrid tiles={tiles} photoPool={photoPool} onExpand={setLightboxTile} />
      ) : (
        <MobileCollage tiles={tiles} photoPool={photoPool} />
      )}
      {lightboxTile && (
        <Lightbox tile={lightboxTile} photoPool={photoPool} onClose={() => setLightboxTile(null)} />
      )}
    </>
  );
}

function DesktopGrid({
  tiles,
  photoPool,
  onExpand,
}: {
  tiles: GalleryTile[];
  photoPool: SitePhotoPool;
  onExpand: (tile: GalleryTile) => void;
}) {
  return (
    <div
      className="grid gap-s4"
      style={{
        gridTemplateColumns: "1.2fr 1fr 1fr",
        // Rows used to be a fixed fr-split of one hardcoded total height
        // (e.g. 840px). That's fragile the moment a copy tile carries real
        // paragraph text: the column (and therefore how many lines the text
        // wraps to) narrows at smaller desktop widths, but a fixed-px row
        // height doesn't grow to match — the text overflowed its box on
        // narrower desktop screens even though it fit fine at 1440px. `auto`
        // rows size to whichever cell in that row actually has content-
        // driven height (the copy tile's text), and the paired photo tile
        // (height: 100%) stretches to match it — same asymmetric look, but
        // it can never clip text again regardless of viewport width.
        gridTemplateRows: "auto auto auto",
        gridTemplateAreas: `"dominant t1 t2" "dominant t3 t4" "dominant t5 t6"`,
      }}
    >
      {tiles.map((tile, i) => (
        <div key={tile.id} style={{ gridArea: AREA_NAMES[i] }}>
          <Reveal delay={i * 60} className="block h-full">
            {tile.type === "image" ? (
              <PhotoTile
                tile={tile}
                image={photoPool[tile.image]?.image}
                onExpand={tile.expandable ? () => onExpand(tile) : undefined}
              />
            ) : (
              <CopyTile tile={tile} />
            )}
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function PhotoTile({
  tile,
  image,
  onExpand,
}: {
  tile: GalleryTile;
  image: SanityImageRef | undefined;
  onExpand?: () => void;
}) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-card shadow-card transition-shadow duration-[var(--dur)] ease-[var(--ease-soft)] hover:shadow-lift">
      {image?.asset && (
        <SanityPicture
          image={image}
          alt={tile.alt}
          sizes="(min-width: 1024px) 480px, 100vw"
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      )}
      {onExpand && <ExpandButton heading={tile.heading} onClick={onExpand} />}
    </div>
  );
}

function CopyTile({ tile }: { tile: GalleryTile }) {
  return (
    <div className="flex h-full w-full flex-col justify-center rounded-card bg-emerald p-s6 shadow-card">
      <div
        aria-hidden="true"
        className="mb-s4 h-px w-[40px] bg-[color-mix(in_srgb,var(--saffron)_55%,transparent)]"
      />
      <h3 className="m-0 font-display text-[1.4rem] leading-[1.1] text-ivory">{tile.heading}</h3>
      <p className="mt-s3 font-body text-[0.8125rem] leading-[1.6] text-sage">{tile.body}</p>
    </div>
  );
}

/**
 * The six strongest, most representative photos out of the gallery's seven
 * tiles — one is dropped for mobile (the "Live Karahi Station" copy tile's
 * photo is the dining room, the one non-food/interior shot of the set, so
 * it's the natural cut for a purely visual food collage). Ids match
 * `galleryTiles` in data/catering.ts.
 */
const COLLAGE_BLOCKS: Array<{
  large: string;
  small1: string;
  small2: string;
  largeSide: "left" | "right";
}> = [
  { large: "karahi", small1: "bbq", small2: "nihari", largeSide: "left" },
  { large: "walima", small1: "breads", small2: "daawat", largeSide: "right" },
];

function MobileCollage({ tiles, photoPool }: { tiles: GalleryTile[]; photoPool: SitePhotoPool }) {
  const byId = new Map(tiles.map((t) => [t.id, t]));

  return (
    <div className="flex flex-col gap-s2">
      {COLLAGE_BLOCKS.map((block, i) => {
        const large = byId.get(block.large);
        const small1 = byId.get(block.small1);
        const small2 = byId.get(block.small2);
        if (!large || !small1 || !small2) return null;
        return (
          <Reveal key={block.large} delay={i * 80}>
            <CollageBlock
              large={large}
              small1={small1}
              small2={small2}
              largeSide={block.largeSide}
              photoPool={photoPool}
            />
          </Reveal>
        );
      })}
    </div>
  );
}

function CollageBlock({
  large,
  small1,
  small2,
  largeSide,
  photoPool,
}: {
  large: GalleryTile;
  small1: GalleryTile;
  small2: GalleryTile;
  largeSide: "left" | "right";
  photoPool: SitePhotoPool;
}) {
  return (
    <div className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-s2">
      {largeSide === "left" && (
        <CollageImage tile={large} image={photoPool[large.image]?.image} className="row-span-2" />
      )}
      <CollageImage tile={small1} image={photoPool[small1.image]?.image} />
      <CollageImage tile={small2} image={photoPool[small2.image]?.image} />
      {largeSide === "right" && (
        <CollageImage tile={large} image={photoPool[large.image]?.image} className="row-span-2" />
      )}
    </div>
  );
}

function CollageImage({
  tile,
  image,
  className,
}: {
  tile: GalleryTile;
  image: SanityImageRef | undefined;
  className?: string;
}) {
  return (
    <div className={cx("relative overflow-hidden", className)}>
      {image?.asset && (
        <SanityPicture
          image={image}
          alt={tile.alt}
          sizes="50vw"
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function ExpandButton({ heading, onClick }: { heading: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Expand ${heading} photo`}
      className="absolute right-s3 top-s3 z-[1] grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_55%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_50%,transparent)] text-ivory backdrop-blur-[2px] transition-[transform,border-color,color,background-color] duration-[var(--dur)] ease-[var(--ease-soft)] hover:border-transparent hover:bg-gold hover:text-ink hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
      </svg>
    </button>
  );
}

function Lightbox({
  tile,
  photoPool,
  onClose,
}: {
  tile: GalleryTile;
  photoPool: SitePhotoPool;
  onClose: () => void;
}) {
  const image = photoPool[tile.image]?.image;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    // Only one focusable element lives inside the dialog, so trapping Tab is
    // just "always land back on the close button" — no need for a full
    // first/last-element cycle like SiteNav's multi-link overlay menu.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tile.heading}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink p-[clamp(20px,5vw,56px)]"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-[clamp(16px,4vw,40px)] top-[clamp(16px,4vw,40px)] grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-pill border border-[color-mix(in_srgb,var(--ivory)_45%,transparent)] text-ivory transition-colors duration-[var(--dur)] hover:border-gold hover:text-gold-bright"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6L18 18M6 18L18 6" />
        </svg>
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative inline-block overflow-hidden rounded-card shadow-lift"
      >
        {/* fill={false} renders next/image in intrinsic mode, using the
            Sanity asset's own metadata dimensions — object-contain with
            auto sizing lets the real ratio through, unlike every other
            usage of this tile's photo which crops into a fixed-height
            object-cover frame. */}
        {image?.asset && (
          <SanityPicture
            image={image}
            alt={tile.alt}
            sizes="92vw"
            fill={false}
            className="block max-h-[85vh] max-w-[92vw] h-auto w-auto object-contain"
          />
        )}
      </div>
    </div>
  );
}
