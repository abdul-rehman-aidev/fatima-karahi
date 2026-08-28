/**
 * Catering data — service options, occasions, catering packages, and the
 * how-it-works steps.
 */

/** The two ways to cater with us — also drives QuoteForm's service-type step (id must match). */
export type CateringServiceOption = {
  id: "in-house" | "outside";
  name: string;
  image: string;
  heading: string;
  body: string;
  ctaLabel: string;
};

export const cateringServiceOptions: CateringServiceOption[] = [
  {
    id: "in-house",
    name: "In-House",
    image: "hero-carousel-1",
    heading: "In-house at Fatima Karahi",
    body: "Book part of our restaurant for your event and we'll set up a full buffet area right here. Your guests eat fresh, hot food straight from our kitchen, no delivery, transport, or setup on your end.",
    ctaLabel: "Ask about booking",
  },
  {
    id: "outside",
    name: "Outside",
    image: "catering",
    heading: "Delivered to your venue",
    body: "Place your order and we'll deliver it hot and ready wherever you're hosting. Want full service too? We can send our own staff to set up and serve at your location, from a boardroom to a wedding hall.",
    ctaLabel: "Get a delivery quote",
  },
];

export type Occasion = {
  id: string;
  name: string;
  urdu?: string;
  image: string;
  line: string;
};

export const occasions: Occasion[] = [
  {
    id: "corporate",
    name: "Corporate Lunch",
    image: "occasion-corporate-lunch",
    line: "Boardroom-ready trays, on time, with plates and serving ware handled.",
  },
  {
    id: "walima",
    name: "Walima",
    urdu: "ولیمہ",
    image: "occasion-walima",
    line: "The full wedding spread, laid beautifully and served generously.",
  },
  {
    id: "mehndi",
    name: "Mehndi",
    urdu: "مہندی",
    image: "occasion-mehndi",
    line: "Colourful, casual, BBQ-forward: food that keeps the dholki going.",
  },
  {
    id: "daawat",
    name: "Birthday / Daawat",
    urdu: "دعوت",
    image: "occasion-daawat",
    line: "Home-style karahi and biryani for the gatherings that matter.",
  },
  {
    id: "community",
    name: "Community & Mosque",
    image: "occasion-community-mosque",
    line: "Volume-friendly menus for iftars, jummah lunches and fundraisers.",
  },
  // Added 2026-08-26 per client request; launched on placeholder photos
  // reusing the existing pool. Dedicated photography supplied 2026-08-27
  // (see assets-src/occasion-*.jpeg) and wired in below.
  {
    id: "dinner-party",
    name: "Dinner Party",
    image: "occasion-dinner-party",
    line: "An intimate table, plated the way a home dinner deserves.",
  },
  {
    id: "birthday-party",
    name: "Birthday Party",
    image: "occasion-birthday-party",
    line: "Karahi, BBQ, and dessert for a celebration worth remembering.",
  },
  {
    id: "anniversary",
    name: "Anniversary Party",
    image: "occasion-anniversary",
    line: "A milestone spread, laid with a little extra care.",
  },
  {
    id: "corporate-events",
    name: "Corporate Events",
    image: "occasion-corporate-events",
    line: "From boardroom lunches to full office parties, handled start to finish.",
  },
];

/**
 * Catering packages — originally sourced from the client-supplied PDF
 * ("Fatima Karahi by Hamza"), which lists Basic $35, Silver $40, Premium
 * $45, Golden $50, and Ultimate $55 per person. Site prices below are each
 * $5/person less than the PDF, per the client's explicit instruction. Item
 * lists matched the PDF exactly at first, one item per line — lines the PDF
 * grouped together (e.g. "Naan - Salad - Raita") were split into separate
 * items here rather than collapsed, and "X or Y" choices are kept as a
 * single line since that's a real either/or choice, not two separate items.
 *
 * Basic/Silver/Premium/Ultimate have since been revised per the client's
 * direct request (2026-08-26) — Golden is untouched and still matches the
 * PDF as-is.
 */
export type CateringPackage = {
  id: string;
  name: string;
  pricePerPerson: number;
  /** true for the top tier — gets the "Best Value" treatment, not a real flag from the PDF */
  featured?: boolean;
  items: string[];
};

export const cateringPackages: CateringPackage[] = [
  {
    id: "basic",
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
    id: "silver",
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
    id: "premium",
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
    id: "golden",
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
    id: "ultimate",
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

export const howItWorks = [
  {
    n: "01",
    title: "Tell us about your event",
    line: "Occasion, guest count, date. Two minutes, no obligation.",
  },
  {
    n: "02",
    title: "We build your menu",
    line: "A Pakistani spread tuned to your taste and budget; we reply within 4 hours.",
  },
  {
    n: "03",
    title: "We deliver & set up",
    line: "Hot, on time, beautifully laid. You host; we handle the dastarkhwan.",
  },
];

/** Quote-form occasion choices (step 1 pills) */
export const quoteOccasions = ["Corporate", "Walima", "Mehndi", "Daawat", "Community", "Other"] as const;

export type GalleryTile = {
  id: string;
  /** desktop rendering: "image" = pure photography, "copy" = dark text card.
   *  Both carry full copy — "copy" tiles' text is hidden on desktop and
   *  shown on mobile, where every tile collapses to a photo-overlay card. */
  type: "image" | "copy";
  /** the one full-height hero tile in the desktop grid */
  dominant?: boolean;
  /** shows the corner expand icon + opens the lightbox */
  expandable?: boolean;
  image: string;
  alt: string;
  heading: string;
  body: string;
};

/** Catering gallery — desktop asymmetric grid / mobile image-overlay stack. */
export const galleryTiles: GalleryTile[] = [
  {
    id: "karahi",
    type: "image",
    dominant: true,
    expandable: true,
    image: "food-karahi",
    alt: "Chicken karahi finishing in a cast-iron pan over open heat",
    heading: "Cast-Iron Karahi",
    body: "Slow-built over real heat, finished tableside the way we've always done it.",
  },
  {
    id: "bbq",
    type: "image",
    image: "food-bbq",
    alt: "Charcoal-grilled BBQ skewers plated for service",
    heading: "Charcoal BBQ",
    body: "Smoked and grilled over live coals, finished right before it reaches you.",
  },
  {
    id: "live-station",
    type: "copy",
    image: "hero-carousel-1",
    alt: "Fatima Karahi table spread set for guests",
    heading: "Live Karahi Station",
    body: "At larger events we fire the karahi live and plate it fresh in front of your guests, instead of arriving pre-cooked in trays. It's the same charcoal-forward, halal Pakistani cooking Fatima Karahi is known for in Edmonton, brought straight to your daawat, walima, or corporate event. Guests watch the spices bloom and the meat finish right before it's served, which makes the catering feel like a real restaurant experience rather than a drop-off.",
  },
  {
    id: "nihari",
    type: "copy",
    image: "food-nihari",
    alt: "Beef nihari simmering in a deep, fragrant gravy",
    heading: "Slow-Cooked Nihari",
    body: "Our beef nihari simmers overnight in a deep, fragrant gravy until the meat falls off the bone, the same slow method behind authentic Pakistani cuisine back home. It's a halal restaurant favorite for winter daawats, walimas, and family gatherings across Edmonton. Every catering order gets that same low and slow treatment, never rushed and never reheated from frozen.",
  },
  {
    id: "daawat",
    type: "image",
    expandable: true,
    image: "catering",
    alt: "A full daawat spread laid for a catering event",
    heading: "The Daawat Table",
    body: "A full spread laid the way Pakistan gathers: rice, curry, bread and dessert, together.",
  },
  {
    id: "walima",
    type: "image",
    image: "food-spread",
    alt: "A wedding-style spread of rice, curry and bread",
    heading: "Walima & Wedding Spreads",
    body: "The full wedding table, laid beautifully and served generous.",
  },
  {
    id: "breads",
    type: "copy",
    image: "must-try-4",
    alt: "Fresh tandoor bread",
    heading: "Fresh Tandoor Breads",
    body: "No Pakistani restaurant spread feels complete without fresh tandoor bread, so ours is blistered to order and brushed with ghee right up until service. We bake naan and roti in small batches throughout your event instead of holding trays under a heat lamp. It's a small detail that halal restaurant regulars in Edmonton notice immediately, and one more reason our catering tastes like a sit-down meal, not a buffet.",
  },
];
