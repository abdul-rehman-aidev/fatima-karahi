/** Mobile collage cell size — see MobileGalleryCollage in GalleryGrid.tsx. */
export type GalleryImageSize = "normal" | "tall" | "wide";

export type GalleryImage = {
  /** base name in public/img, e.g. "food-karahi" */
  name: string;
  alt: string;
  /**
   * Mobile 2-column collage size. Defaults to "normal" (1 col × 1 row) if
   * omitted. "tall" spans 2 rows, "wide" spans both columns. Edit freely per
   * photo — first-pass mix, not load-bearing on anything else.
   */
  size?: GalleryImageSize;
};

/**
 * The 13 real photography assets available (see scripts/optimize-images.mjs)
 * with a full avif/webp/jpg set at 480/828/1200w or wider — a mixed food +
 * interior + catering pool, not a clean 3-way split, so this ships as one
 * continuous grid rather than category tabs.
 */
export const galleryImages: GalleryImage[] = [
  { name: "hero-carousel-1", alt: "Fatima Karahi dining room set for service", size: "wide" },
  { name: "food-karahi", alt: "Chicken karahi finishing in a cast-iron pan over open heat" },
  {
    name: "must-try-3",
    alt: "Chapli kebab, one of Fatima Karahi's signature dishes",
    size: "tall",
  },
  { name: "hero-carousel-2", alt: "Fatima Karahi dining room and table spread" },
  { name: "food-bbq", alt: "Charcoal-grilled BBQ skewers plated for service" },
  { name: "catering", alt: "A catering spread laid for a daawat", size: "wide" },
  { name: "must-try-1", alt: "A plated Pakistani dish at Fatima Karahi" },
  {
    name: "food-nihari",
    alt: "Slow-cooked beef nihari, a Fatima Karahi daawat staple",
    size: "tall",
  },
  { name: "hero-carousel-3", alt: "Fatima Karahi dining room and table spread" },
  { name: "must-try-4", alt: "Zarda, a traditional sweet rice dessert" },
  {
    name: "food-spread",
    alt: "A full Fatima Karahi table spread of karahi, BBQ, and daawat sides",
    size: "tall",
  },
  { name: "must-try-2", alt: "A Pakistani dish served at Fatima Karahi" },
  { name: "hero-carousel-4", alt: "Fatima Karahi dining room and table spread" },
];
