"use client";

import { useState } from "react";
import { Divider } from "@/components/ds/Divider";
import { Picture } from "@/components/media/Picture";
import { cx } from "@/lib/cx";
import type { GalleryRole, GalleryTile } from "@/data/gallery";

/**
 * Gallery collage — a responsive CSS grid (`grid-flow-row-dense` + each
 * tile's own `role` span) with one bit of client JS: a "See more" reveal.
 *
 * Client-requested change (2026-08-27): the full 59-tile set (55 real photos
 * + 4 SEO copy tiles) must not all load at once — only the first BATCH_SIZE
 * tiles are ever mounted, so the browser never issues a request for anything
 * beyond what's actually shown. Clicking "See more" mounts the next batch;
 * the button disappears once every tile is visible. This is the one
 * deliberate trade of "zero client JS" (see the previous version's comment)
 * for "don't ship a 55-photo network payload on page load" — a `useState`
 * and a slice is a small price for that.
 */
const BATCH_SIZE = 9;

const roleSpan: Record<GalleryRole, string> = {
  feature: "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-3 lg:row-span-2",
  wide: "col-span-2 row-span-1 sm:col-span-4 sm:row-span-1 lg:col-span-3 lg:row-span-1",
  tall: "col-span-1 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
  normal: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-1",
};

const roleSizes: Record<GalleryRole, string> = {
  feature: "(min-width: 640px) 50vw, 100vw",
  wide: "(min-width: 1024px) 50vw, 100vw",
  tall: "(min-width: 1024px) 33vw, 50vw",
  normal: "(min-width: 1024px) 33vw, 50vw",
};

export function GalleryGrid({ tiles }: { tiles: GalleryTile[] }) {
  const [visibleCount, setVisibleCount] = useState(Math.min(BATCH_SIZE, tiles.length));
  const visible = tiles.slice(0, visibleCount);
  const hasMore = visibleCount < tiles.length;

  return (
    <div className="bg-emerald-deep px-s5 py-s6 md:px-s7 md:py-s8">
      <div className="mx-auto grid max-w-content grid-cols-2 grid-flow-row-dense gap-s5 [grid-auto-rows:44vw] sm:grid-cols-4 sm:gap-s6 sm:[grid-auto-rows:22vw] lg:grid-cols-6 lg:[grid-auto-rows:15vw]">
        {visible.map((tile, i) =>
          tile.type === "quote" ? (
            <QuoteTile key={`quote-${i}`} tile={tile} />
          ) : (
            <PhotoTile key={tile.name} tile={tile} />
          ),
        )}
      </div>

      {hasMore && (
        <div className="mt-s7 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => Math.min(n + BATCH_SIZE, tiles.length))}
            className="cursor-pointer rounded-pill border border-[color-mix(in_srgb,var(--gold)_45%,transparent)] bg-transparent px-s6 py-s3 font-body text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-gold-bright transition-colors duration-[var(--dur)] ease-[var(--ease-soft)] hover:bg-gold hover:text-ink"
          >
            See more ({tiles.length - visibleCount} left)
          </button>
        </div>
      )}
    </div>
  );
}

function PhotoTile({ tile }: { tile: Extract<GalleryTile, { type: "photo" }> }) {
  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-card shadow-card",
        roleSpan[tile.role],
      )}
    >
      <Picture
        name={tile.name}
        alt={tile.alt}
        widths={[480, 828, 1200]}
        sizes={roleSizes[tile.role]}
        width={1200}
        height={1500}
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[var(--dur-slow)] motion-safe:ease-[var(--ease-soft)] motion-safe:group-hover:scale-[1.045]"
      />
    </div>
  );
}

function QuoteTile({ tile }: { tile: Extract<GalleryTile, { type: "quote" }> }) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center gap-s4 rounded-card border border-[color-mix(in_srgb,var(--gold)_30%,transparent)] bg-[color-mix(in_srgb,var(--ivory)_6%,transparent)] px-s5 py-s6 text-center",
        roleSpan[tile.role],
      )}
    >
      <Divider width={64} className="opacity-80" />
      <p className="m-0 max-w-[26ch] font-editorial text-[clamp(1.05rem,2vw,1.35rem)] italic leading-[1.4] text-ivory">
        {tile.text}
      </p>
    </div>
  );
}
