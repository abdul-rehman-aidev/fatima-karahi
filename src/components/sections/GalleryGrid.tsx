"use client";

import { useState } from "react";
import {
  DraggableContainer,
  GridBody,
  GridItem,
  gridItemStyles,
} from "@/components/ds/DraggableGrid";
import { Picture } from "@/components/media/Picture";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cx } from "@/lib/cx";
import type { GalleryImage } from "@/data/gallery";

/**
 * Gallery page canvas. Three structurally different branches (same
 * conditional-mount split pattern as MenuSection/CateringGallery/
 * OccasionsCarousel — the mobile and desktop layouts are different enough
 * structures that one is mounted, not both rendered and hidden with CSS):
 *  - Mobile (<1024px): a static, non-interactive 2-column collage that
 *    scrolls with the page — no drag, no wheel-hijack, no infinite wrap.
 *    Checked first and unconditional, regardless of motion preference: it's
 *    already static, so there's nothing for reduced-motion to fall back
 *    from.
 *  - Desktop + normal motion: the draggable/wheel-pannable infinite masonry
 *    canvas, with a "Drag to explore" hint that fades out for good on first
 *    drag (local state only, not persisted).
 *  - Desktop + `prefers-reduced-motion: reduce`: a plain static grid,
 *    block-scrollable, no drag/wheel-hijack, no entrance animation.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const touch = useMediaQuery("(pointer: coarse)", false);
  const [hintVisible, setHintVisible] = useState(true);

  if (!isDesktop) {
    return <MobileGalleryCollage images={images} />;
  }

  if (reducedMotion) {
    return <StaticMasonryGrid images={images} />;
  }

  return (
    <div className="relative">
      <DraggableContainer
        variant="masonry"
        className="bg-emerald-deep"
        onDragStart={() => setHintVisible(false)}
      >
        <GridBody>
          {images.map((image) => (
            <GridItem key={image.name} className="w-[150px] sm:w-[280px] md:w-[320px]">
              <GalleryPhoto image={image} />
            </GridItem>
          ))}
        </GridBody>
      </DraggableContainer>
      <DragHint visible={hintVisible} touch={touch} />
    </div>
  );
}

/**
 * Mobile-only static collage: exactly 2 equal columns, `dense` auto-flow so
 * the "tall"/"wide" cells (see `GalleryImage.size` in data/gallery.ts) pack
 * without leaving gaps. `auto-rows` is a vw-based base unit rather than a
 * fixed px value so the near-square "normal" cell proportion holds across
 * phone widths; "tall" cells are exactly 2 of those rows plus the row gap,
 * "wide" cells span both columns at 1 row. Same gap (`s6`) and photo-frame
 * treatment (rounded-card, shadow-card) as the desktop canvas — no drag, no
 * wheel listener, no entrance animation, just a normal block that scrolls
 * with the page. Reachable at any point <1024px, desktop's own breakpoint —
 * this is now unconditionally desktop's only static-grid path.
 */
function MobileGalleryCollage({ images }: { images: GalleryImage[] }) {
  return (
    <div className="bg-emerald-deep px-s5 py-s6">
      <div className="grid grid-cols-2 grid-flow-row-dense gap-s6 [grid-auto-rows:48vw]">
        {images.map((image) => (
          <div
            key={image.name}
            className={cx(
              "relative overflow-hidden rounded-card shadow-card",
              image.size === "tall" && "row-span-2",
              image.size === "wide" && "col-span-2",
            )}
          >
            <Picture
              name={image.name}
              alt={image.alt}
              widths={[480, 828]}
              sizes="50vw"
              width={1200}
              height={1500}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop-only now (mobile always takes MobileGalleryCollage above,
// regardless of motion preference) — the reduced-motion fallback for
// desktop users, unchanged from before that split existed.
function StaticMasonryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className="h-dvh overflow-y-auto bg-emerald-deep">
      <div className="grid grid-cols-2 gap-s6 p-s5 sm:grid-cols-3 md:gap-s9 md:p-s7 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.name} className={gridItemStyles({ variant: "masonry" })}>
            <GalleryPhoto image={image} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryPhoto({ image }: { image: GalleryImage }) {
  return (
    <div className="relative aspect-[4/5] w-full">
      <Picture
        name={image.name}
        alt={image.alt}
        widths={[480, 828]}
        sizes="(min-width: 768px) 320px, (min-width: 640px) 280px, 150px"
        width={1200}
        height={1500}
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />
    </div>
  );
}

function DragHint({ visible, touch }: { visible: boolean; touch: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 z-[1] flex items-center justify-center transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-soft)]",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="inline-flex items-center gap-s2 rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--saffron)_50%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_65%,transparent)] px-s5 py-s3 font-body text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ivory shadow-lift backdrop-blur-[2px]">
        <DragGlyph />
        {touch ? "Swipe to explore" : "Drag to explore"}
      </span>
    </div>
  );
}

function DragGlyph() {
  return (
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
      className="text-gold"
    >
      <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />
    </svg>
  );
}
