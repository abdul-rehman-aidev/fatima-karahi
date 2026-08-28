/**
 * Pre-generates responsive AVIF/WebP/JPEG variants for the static export
 * (the default Next optimizer is unavailable with `output: 'export'`).
 *
 * Source of truth: assets-src/*.jpg  →  public/img/{name}-{width}.{avif,webp,jpg}
 * Swapping real photography in = drop the new file into assets-src/ with the
 * same name (same crop/aspect) and re-run `npm run images`.
 *
 * CACHING (added after a Netlify build timed out at 18 minutes re-encoding
 * every source on every deploy): each source file's SHA-256 content hash is
 * recorded in scripts/.image-manifest.json alongside the output paths it
 * produced. A source is only re-encoded if its hash changed since the last
 * run OR one of its expected outputs is missing from disk — otherwise it's
 * skipped. Both the manifest and public/img's generated files are committed
 * to git (see .gitignore — neither is excluded), so on a fresh clone the
 * outputs are already correct and a normal CI run is just a hash-check
 * confirming nothing changed, not a full re-encode. This is why mtime can't
 * be used for the check instead: `git clone` resets every file's mtime to
 * checkout time, so source and output timestamps land within moments of
 * each other regardless of whether the source content actually changed —
 * content hashing is the only signal that survives a clone. Deliberately
 * has no host-specific branch (no `process.env.NETLIFY` or similar): the
 * script is fast everywhere because the cache is real files in the repo,
 * not because it detects and skips work on a particular CI provider (which
 * would silently ship a build missing any image the platform never
 * generated, e.g. if the manifest is a version behind and someone forgot to
 * re-run this locally before pushing — an explicit hash mismatch fails loud
 * as a slow-but-correct regenerate instead of a silent gap).
 */
import sharp from "sharp";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const SRC = "assets-src";
const OUT = "public/img";
const MANIFEST_PATH = "scripts/.image-manifest.json";
// Bounded concurrency for the sources that DO need (re)encoding — matters
// most on a from-scratch run (fresh clone with no manifest yet, or a large
// new photo batch added at once) where the cache can't help at all.
const CONCURRENCY = 6;

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

/**
 * One-off crops that don't follow the widths×formats pattern above, each
 * keyed by the same source `name` JOBS uses. A source can appear in both
 * maps at once — hero-carousel-1 does: the full responsive set from JOBS
 * plus the single OG crop below.
 */
const SPECIALS = {
  "hero-carousel-1": [
    {
      dest: "public/og.jpg",
      run: (img) => img.resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80, mozjpeg: true }),
    },
  ],
  // Banner crop for the homepage "mood moment" section — pinned via
  // `position: sticky`, not a scroll-transformed layer, so it just needs to
  // fill a normal-aspect box (no extra vertical headroom to reveal as it
  // scrolls, unlike the transform-based approach this replaced).
  parallax: [
    {
      dest: path.join(OUT, "parallax-1920.jpg"),
      run: (img) => img.resize(1920, 1000, { fit: "cover" }).jpeg({ quality: 78, mozjpeg: true }),
    },
  ],
};

function outputsFor(name) {
  const outputs = [];
  const widths = JOBS[name];
  if (widths) {
    for (const width of widths) {
      for (const [ext] of FORMATS) outputs.push(path.join(OUT, `${name}-${width}.${ext}`));
    }
  }
  for (const special of SPECIALS[name] ?? []) outputs.push(special.dest);
  return outputs;
}

async function generate(name, srcPath) {
  const widths = JOBS[name];
  if (widths) {
    for (const width of widths) {
      for (const [ext, encode] of FORMATS) {
        const dest = path.join(OUT, `${name}-${width}.${ext}`);
        await encode(sharp(srcPath).resize({ width })).toFile(dest);
      }
    }
  }
  for (const special of SPECIALS[name] ?? []) {
    await special.run(sharp(srcPath)).toFile(special.dest);
  }
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return {}; // no manifest yet (first run, or it isn't committed for some reason)
  }
}

/** Small hand-rolled concurrency-limited pool — not worth a dependency for this. */
async function runWithConcurrency(items, limit, worker) {
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
}

const start = Date.now();
await mkdir(OUT, { recursive: true });

const manifest = await loadManifest();
const files = await readdir(SRC);

// Decide what needs (re)encoding — hashing every candidate is cheap (a few
// MB of reads, not full-size re-encodes) so this pass runs even on a
// full-cache-hit run and still finishes in seconds.
const candidates = [];
for (const file of files) {
  const name = path.parse(file).name;
  const outputs = outputsFor(name);
  if (outputs.length === 0) continue; // source not referenced by any job
  candidates.push({ file, name, outputs });
}

const toProcess = [];
let skipped = 0;
for (const c of candidates) {
  const srcPath = path.join(SRC, c.file);
  const hash = await sha256(srcPath);
  const entry = manifest[c.file];
  const outputsExist = c.outputs.every((o) => existsSync(o));
  if (entry?.hash === hash && outputsExist) {
    skipped++;
    continue;
  }
  toProcess.push({ ...c, srcPath, hash });
}

let filesWritten = 0;
await runWithConcurrency(toProcess, CONCURRENCY, async (c) => {
  await generate(c.name, c.srcPath);
  manifest[c.file] = { hash: c.hash, outputs: c.outputs };
  filesWritten += c.outputs.length;
  console.log(`  regenerated ${c.file} → ${c.outputs.length} file(s)`);
});

// Drop manifest entries for sources that no longer exist in assets-src, so
// a deleted photo doesn't leave a stale, never-checked entry behind.
const currentFiles = new Set(files);
for (const key of Object.keys(manifest)) {
  if (!currentFiles.has(key)) delete manifest[key];
}

await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(
  `optimize-images: ${toProcess.length} source(s) regenerated (${filesWritten} files written), ` +
    `${skipped} source(s) skipped (cache hit) — ${elapsed}s`,
);
