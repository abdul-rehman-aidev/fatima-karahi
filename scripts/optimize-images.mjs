/**
 * Pre-generates responsive AVIF/WebP/JPEG variants for the static export
 * (the default Next optimizer is unavailable with `output: 'export'`).
 *
 * Source of truth: assets-src/*.jpg  →  public/img/{name}-{width}.{avif,webp,jpg}
 * Swapping real photography in = drop the new file into assets-src/ with the
 * same name (same crop/aspect) and re-run `npm run images`.
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-src";
const OUT = "public/img";

/** name → responsive widths (must match the sizes used in <Picture>) */
const JOBS = {
  // 1600w included for this one alongside "catering" — both are used as the
  // two expandable/lightbox tiles in the catering gallery, which needs a
  // larger source than the 1200w ceiling used for normal grid/card imagery.
  "food-karahi": [480, 828, 1200, 1600],
  "food-nihari": [480, 828, 1200],
  "food-bbq": [480, 828, 1200],
  "food-spread": [480, 828, 1200, 1600],
  catering: [480, 828, 1200, 1600],
  "must-try-1": [480, 828, 1200],
  "must-try-2": [480, 828, 1200],
  "must-try-3": [480, 828, 1200],
  "must-try-4": [480, 828, 1200],
  // 480w included even though the hero carousel itself never requests it
  // (sizes="100vw" starts at 640) — these four are also reused as Must Try
  // card photos (data/menu.ts dish.image), which do request 480w.
  "hero-carousel-1": [480, 640, 828, 1200, 1920],
  "hero-carousel-2": [480, 640, 828, 1200, 1920],
  "hero-carousel-3": [480, 640, 828, 1200, 1920],
  "hero-carousel-4": [480, 640, 828, 1200, 1920],
  // One photo per menu section (data/menu.ts MenuCategory.image) — no more
  // per-dish photos. Kids Menu and Breakfast Specials intentionally have no
  // source here, so no image renders for those sections.
  "menu-appetizers": [480, 828, 1200],
  "menu-bbq": [480, 828, 1200],
  "menu-chicken-karahi": [480, 828, 1200],
  "menu-lamb-karahi": [480, 828, 1200],
  "menu-goat-karahi": [480, 828, 1200],
  "menu-vegetarian": [480, 828, 1200],
  "menu-bread": [480, 828, 1200],
  "menu-rice": [480, 828, 1200],
  "menu-fast-food": [480, 828, 1200],
  "menu-kebab-karahi": [480, 828, 1200],
  "menu-sides": [480, 828, 1200],
  "menu-curry": [480, 828, 1200],
  "menu-mocktails": [480, 828, 1200],
  "menu-drinks": [480, 828, 1200],
  "menu-shakes": [480, 828, 1200],
  "menu-desserts": [480, 828, 1200],
  // Gallery page collage (55 photos: 33 professionally shot + 22 real
  // customer photos) — masters already resized/re-encoded to a web-appropriate
  // size (long edge capped ~2000px) by a one-off script; see
  // assets-src/gallery-manifest.json for the source mapping. Same widths as
  // every other card/grid image in this file since GalleryGrid's <Picture>
  // calls request the same [480, 828, 1200] set regardless of tile role.
  ...Object.fromEntries(
    Array.from({ length: 33 }, (_, i) => [`gallery-pro-${String(i + 1).padStart(2, "0")}`, [480, 828, 1200]]),
  ),
  ...Object.fromEntries(
    Array.from({ length: 22 }, (_, i) => [`gallery-nat-${String(i + 1).padStart(2, "0")}`, [480, 828, 1200]]),
  ),
  // Catering page "Occasions" rail (data/catering.ts occasions[]) — one
  // dedicated photo per occasion, replacing the reused/placeholder photos
  // the section launched with. Same [480, 828, 1200] set as OccasionCard's
  // <Picture> call.
  "occasion-corporate-lunch": [480, 828, 1200],
  "occasion-walima": [480, 828, 1200],
  "occasion-mehndi": [480, 828, 1200],
  "occasion-daawat": [480, 828, 1200],
  "occasion-community-mosque": [480, 828, 1200],
  "occasion-dinner-party": [480, 828, 1200],
  "occasion-birthday-party": [480, 828, 1200],
  "occasion-anniversary": [480, 828, 1200],
  "occasion-corporate-events": [480, 828, 1200],
};

const FORMATS = [
  ["avif", (img) => img.avif({ quality: 55 })],
  ["webp", (img) => img.webp({ quality: 74 })],
  ["jpg", (img) => img.jpeg({ quality: 78, mozjpeg: true })],
];

await mkdir(OUT, { recursive: true });
const files = await readdir(SRC);
let count = 0;

for (const file of files) {
  const name = path.parse(file).name;
  const widths = JOBS[name];
  if (!widths) continue;
  for (const width of widths) {
    for (const [ext, encode] of FORMATS) {
      const dest = path.join(OUT, `${name}-${width}.${ext}`);
      await encode(sharp(path.join(SRC, file)).resize({ width })).toFile(dest);
      count++;
    }
  }
}

// OpenGraph card (1200×630) from the hero carousel's first slide
await sharp(path.join(SRC, "hero-carousel-1.jpg"))
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile("public/og.jpg");
count++;

// Banner crop for the homepage "mood moment" section — pinned via
// `position: sticky`, not a scroll-transformed layer, so it just needs to
// fill a normal-aspect box (no extra vertical headroom to reveal as it
// scrolls, unlike the transform-based approach this replaced).
await sharp(path.join(SRC, "parallax.jpg"))
  .resize(1920, 1000, { fit: "cover" })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(path.join(OUT, "parallax-1920.jpg"));
count++;

console.log(`optimize-images: wrote ${count} files to ${OUT}`);
