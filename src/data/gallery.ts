/**
 * Gallery collage — real Fatima Karahi photography: a mix of professionally
 * shot dishes/drinks and photos shared by real customers, replacing the
 * earlier placeholder set that reused hero/menu-section images. Source
 * masters and the pro/nat split live in assets-src/gallery-manifest.json
 * (the "gallery-pro-NN" / "gallery-nat-NN" names are cross-referenced there
 * back to each original filename) — edit this file by hand from here on.
 *
 * Progressive reveal (GalleryGrid.tsx) mounts tiles in batches rather than
 * all 55 at once, so photos beyond the current batch are never fetched —
 * "type" and "role" work exactly as before (see GalleryGrid.tsx's roleSpan).
 * A handful of "quote" tiles carry short SEO copy, interspersed through the
 * photos rather than left as one long intro paragraph.
 */
export type GalleryRole = "feature" | "wide" | "tall" | "normal";

export type GalleryTile =
  | {
      type: "photo";
      /** base name in public/img, e.g. "gallery-pro-01" */
      name: string;
      alt: string;
      role: GalleryRole;
    }
  | {
      type: "quote";
      text: string;
      role: GalleryRole;
    };

export const galleryTiles: GalleryTile[] = [
  {
    type: "photo",
    name: "gallery-pro-01",
    alt: "Two hands toasting with blue and orange mocktails",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-02",
    alt: "A Blue Lagoon mocktail garnished with an orange twist",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-03",
    alt: "Guests sharing a table spread of curry, chicken tikka, and a mango shake",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-01",
    alt: "A table spread shared by a Fatima Karahi customer",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-02",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-04",
    alt: "A guest enjoying a forkful of grilled chicken malai boti",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-05",
    alt: "Gulab jamun and khoya kheer plated for dessert",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-pro-06",
    alt: "A guest dipping naan into a bowl of curry",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-nat-03",
    alt: "Inside Fatima Karahi's dining room",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-04",
    alt: "Inside Fatima Karahi's dining room",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-07",
    alt: "Goat karahi curry finishing in a cast-iron pan",
    role: "wide"
  },
  {
    type: "quote",
    text: "Halal Pakistani cuisine, cooked fresh in Edmonton — never frozen, never rushed.",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-08",
    alt: "Goat karahi served tableside in a cast-iron dish",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-09",
    alt: "A plate of stir-fried chicken chowmein noodles",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-05",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-06",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-10",
    alt: "A sizzling platter of chicken malai boti with onions and salad",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-11",
    alt: "A BBQ platter of seekh kebab and tandoori chicken tikka",
    role: "feature"
  },
  {
    type: "photo",
    name: "gallery-pro-12",
    alt: "A charcoal-grilled BBQ platter of kebab and chicken tikka on a wooden board",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-07",
    alt: "A meal shared by a Fatima Karahi customer",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-08",
    alt: "A buffet spread set up at Fatima Karahi",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-13",
    alt: "Squeezing fresh lemon over a sizzling BBQ platter",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-pro-14",
    alt: "A basket of crispy fried chicken pakora with lemon",
    role: "normal"
  },
  {
    type: "quote",
    text: "From cast-iron karahi to charcoal BBQ: every dish here is halal, family-recipe, and made to order.",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-15",
    alt: "Beef nihari simmering in a traditional copper handi",
    role: "feature"
  },
  {
    type: "photo",
    name: "gallery-nat-09",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-10",
    alt: "A customer's meal at Fatima Karahi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-16",
    alt: "Lifting a spoonful of slow-cooked beef nihari from the handi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-17",
    alt: "A mint mocktail garnished with a lemon wedge",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-18",
    alt: "A hand holding a mug of Kashmiri chai topped with pistachios",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-11",
    alt: "A spread shared by a Fatima Karahi customer",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-12",
    alt: "A decorative wall detail inside Fatima Karahi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-19",
    alt: "A hand holding a mug of desi chai",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-pro-20",
    alt: "Chicken tikka bone-in served over jeera rice",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-21",
    alt: "A lamb biryani platter garnished with fresh coriander",
    role: "wide"
  },
  {
    type: "quote",
    text: "Real daawats, real customers: this gallery is a mix of our own photography and moments guests have shared with us.",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-nat-13",
    alt: "Inside Fatima Karahi's dining room",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-14",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-22",
    alt: "A whole roasted lamb shank served over Kabuli pulao with carrots and raisins",
    role: "feature"
  },
  {
    type: "photo",
    name: "gallery-pro-23",
    alt: "Beef haleem garnished with ginger and coriander",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-pro-24",
    alt: "Fresh naan folded in a basket",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-15",
    alt: "A meal shared by a Fatima Karahi customer",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-16",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-25",
    alt: "Garlic naan cut into triangles, fresh from the tandoor",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-26",
    alt: "Plain naan fresh from the tandoor",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-27",
    alt: "A charcoal-grilled dish from Fatima Karahi's kitchen",
    role: "wide"
  },
  {
    type: "photo",
    name: "gallery-nat-17",
    alt: "A full daawat spread of leg roast, biryani, chowmein, and kebabs shared by a customer",
    role: "feature"
  },
  {
    type: "quote",
    text: "Catering weddings, mehndis, and corporate events across Edmonton with the same halal Pakistani menu you see here.",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-nat-18",
    alt: "Inside Fatima Karahi's dining room, with its signature wood lattice wall",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-28",
    alt: "Mango, strawberry, and chocolate milkshakes lined up on the table",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-29",
    alt: "A milkshake topped with whipped cream at Fatima Karahi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-30",
    alt: "A cold beverage served at Fatima Karahi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-19",
    alt: "A dish shared by a Fatima Karahi customer",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-20",
    alt: "A meal shared by a Fatima Karahi customer",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-pro-31",
    alt: "A traditional Pakistani dessert served at Fatima Karahi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-32",
    alt: "A refreshing mango lassi at Fatima Karahi",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-pro-33",
    alt: "A dish from Fatima Karahi's dessert menu",
    role: "tall"
  },
  {
    type: "photo",
    name: "gallery-nat-21",
    alt: "A spread shared by a Fatima Karahi customer",
    role: "normal"
  },
  {
    type: "photo",
    name: "gallery-nat-22",
    alt: "A meal shared by a Fatima Karahi customer",
    role: "normal"
  }
];
