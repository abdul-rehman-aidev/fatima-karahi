// One-off script: uploads the marketing photos still on the local pipeline
// into Sanity as the "sitePhotos" singleton. Run once to seed the document;
// after that, Sanity Studio is the source of truth — re-running this
// OVERWRITES the singleton (createOrReplace), clobbering any captions/tags
// added in Studio since.
//
// Requires SANITY_API_WRITE_TOKEN (Editor/Administrator role, generated at
// manage.sanity.io -> API -> Tokens) in the environment — the app's own
// SANITY_API_READ_TOKEN is viewer-role and cannot write.
//
// Usage: SANITY_API_WRITE_TOKEN=... node scripts/migrate-site-photos.mjs

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "assets-src");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({
  projectId: "pcb497o9",
  dataset: "production",
  apiVersion: "2026-08-30",
  token,
  useCdn: false,
});

const PHOTOS = [
  { key: "hero-carousel-1", file: "hero-carousel-1.jpg", tag: "hero", alt: "Beef karahi simmering in a cast-iron pan, garnished with coriander and green chilies" },
  { key: "hero-carousel-2", file: "hero-carousel-2.jpg", tag: "hero", alt: "Whole roasted lamb leg served over spiced Pakistani rice with almonds and raisins" },
  { key: "hero-carousel-3", file: "hero-carousel-3.jpg", tag: "hero", alt: "Charcoal-grilled tandoori chicken and seekh kebabs fresh off the grill" },
  { key: "hero-carousel-4", file: "hero-carousel-4.jpg", tag: "hero", alt: "Chicken tikka boti served over fragrant Pakistani rice" },
  { key: "founder", file: "founder.jpg", tag: "people", alt: "Hamza Butt, founder of Fatima Karahi" },
  { key: "food-bbq", file: "food-bbq.jpg", tag: "food", alt: "Charcoal-grilled BBQ skewers plated for service" },
  { key: "food-karahi", file: "food-karahi.jpg", tag: "food", alt: "Chicken karahi finishing in a cast-iron pan over open heat" },
  { key: "food-nihari", file: "food-nihari.jpg", tag: "food", alt: "Beef nihari simmering in a deep, fragrant gravy" },
  { key: "food-spread", file: "food-spread.jpg", tag: "food", alt: "A full Lahori dastarkhwan laid for a daawat" },
  { key: "catering", file: "catering.jpg", tag: "moment", alt: "A full daawat spread laid for a catering event" },
  { key: "parallax", file: "parallax.jpg", tag: "moment", alt: "A catered table set for guests" },
  { key: "must-try-4", file: "must-try-4.jpg", tag: "food", alt: "Fresh tandoor bread" },
  { key: "occasion-corporate-lunch", file: "occasion-corporate-lunch.jpeg", tag: "occasion", alt: "A corporate lunch spread laid out boardroom-style" },
  { key: "occasion-walima", file: "occasion-walima.jpeg", tag: "occasion", alt: "A walima wedding table laid with a full spread" },
  { key: "occasion-mehndi", file: "occasion-mehndi.jpeg", tag: "occasion", alt: "A colourful mehndi spread with BBQ-forward dishes" },
  { key: "occasion-daawat", file: "occasion-daawat.jpeg", tag: "occasion", alt: "A home-style daawat table of karahi and biryani" },
  { key: "occasion-community-mosque", file: "occasion-community-mosque.jpeg", tag: "occasion", alt: "A volume catering setup for a community or mosque event" },
  { key: "occasion-dinner-party", file: "occasion-dinner-party.jpeg", tag: "occasion", alt: "An intimate dinner party table, plated for guests" },
  { key: "occasion-birthday-party", file: "occasion-birthday-party.jpeg", tag: "occasion", alt: "A birthday party spread of karahi, BBQ, and dessert" },
  { key: "occasion-anniversary", file: "occasion-anniversary.jpeg", tag: "occasion", alt: "An anniversary celebration table laid with extra care" },
  { key: "occasion-corporate-events", file: "occasion-corporate-events.jpeg", tag: "occasion", alt: "A full-service corporate event catering setup" },
];

async function main() {
  const photos = [];

  for (const p of PHOTOS) {
    const filePath = path.join(ASSETS_DIR, p.file);
    const buffer = await readFile(filePath);
    const asset = await client.assets.upload("image", buffer, { filename: p.file });
    photos.push({
      _type: "sitePhoto",
      _key: p.key,
      key: p.key,
      tag: p.tag,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: p.alt,
      },
    });
    console.log(`uploaded ${p.key} (${asset._id})`);
  }

  await client.createOrReplace({ _id: "sitePhotos", _type: "sitePhotos", photos });
  console.log(`\nDone — wrote ${photos.length} photos to the "sitePhotos" singleton.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
