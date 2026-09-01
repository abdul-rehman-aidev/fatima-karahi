// One-off script: seeds the "cateringPackages" singleton in Sanity with the
// five set-menu packages that used to be hardcoded in src/data/catering.ts.
// Run once; after that, Sanity Studio is the source of truth — re-running
// this OVERWRITES the singleton (createOrReplace).
//
// Requires SANITY_API_WRITE_TOKEN (Editor/Administrator role) in the
// environment — the app's own SANITY_API_READ_TOKEN is viewer-role and
// cannot write.
//
// Usage: SANITY_API_WRITE_TOKEN=... node scripts/migrate-catering-packages.mjs

import { createClient } from "@sanity/client";

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

// Originally sourced from the client-supplied PDF ("Fatima Karahi by
// Hamza"): Basic $35, Silver $40, Premium $45, Golden $50, Ultimate $55 per
// person. Site prices are each $5/person less, per the client's explicit
// instruction. Basic/Silver/Premium/Ultimate were revised again per the
// client's direct request (2026-08-26) — Golden still matches the PDF as-is.
const PACKAGES = [
  {
    name: "Basic Package",
    pricePerPerson: 30,
    items: [
      "Chicken Tikka With Bone",
      "Chicken Karahi",
      "Chana Masala",
      "Pulao Rice",
      "Naan",
      "Kheer",
      "Raita",
      "Salad",
      "2 Liter Pop",
      "Chai",
    ],
  },
  {
    name: "Silver Package",
    pricePerPerson: 35,
    items: [
      "Chicken Tikka With Bone",
      "Beef Kabab",
      "Chicken Karahi",
      "Chana Masala",
      "Pulao Rice",
      "Chicken Chowmein",
      "Khoya Kheer",
      "Naan",
      "Raita",
      "Salad",
      "2 Liter Pop",
      "Chai",
    ],
  },
  {
    name: "Premium Package",
    pricePerPerson: 40,
    items: [
      "Papri Chat",
      "Fish Pokora",
      "Chicken Tikka With Bone",
      "Beef Kabab",
      "Lamb/Goat Karahi",
      "Goat Pulao or Chicken Pulao",
      "Chana Masala or Palak Paneer",
      "Chicken Chowmein",
      "Naan",
      "Salad",
      "Raita",
      "Kheer",
      "Gulab Jaman",
      "2 Liter Pop",
      "Chai",
    ],
  },
  {
    name: "Golden Package",
    pricePerPerson: 45,
    items: [
      "Papri Chat",
      "Chicken Tikka With Bone",
      "Butter Chicken",
      "Goat/Chicken Pulao",
      "Fish Pokora",
      "Chana Masala or Palak Paneer",
      "Beef Kabab",
      "Chicken Chowmein",
      "Chicken Karahi",
      "Naan",
      "Salad",
      "Raita",
      "2 Liter Pop",
      "Kheer",
      "Gulab Jaman",
      "Chai",
    ],
  },
  {
    name: "Ultimate Package",
    pricePerPerson: 50,
    featured: true,
    items: [
      "Fries",
      "Papri Chat",
      "Gol Gappay",
      "Butter Chicken",
      "Chicken Tikka With Bone",
      "Beef Kabab or Chicken Kabab",
      "Goat Pulao or Chicken Pulao",
      "Goat, Lamb, or Chicken Karahi",
      "Beef Nihari",
      "Chana Masala or Palak Paneer",
      "Chicken Chowmein",
      "Naan",
      "Salad",
      "Raita",
      "Kheer",
      "Trifle",
      "2 Liter Pop",
      "Chai",
    ],
  },
];

async function main() {
  const packages = PACKAGES.map((pkg, i) => ({
    _type: "cateringPackage",
    _key: pkg.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `package-${i}`,
    ...pkg,
  }));

  await client.createOrReplace({ _id: "cateringPackages", _type: "cateringPackages", packages });
  console.log(`Done — wrote ${packages.length} packages to the "cateringPackages" singleton.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
