/**
 * Site-wide facts — THE single file to edit when real client values arrive.
 * Every TODO(client) below is a placeholder carried over from the design
 * reference; nothing else in the codebase hard-codes these values.
 */

export const site = {
  name: "Fatima Karahi",
  nameUrdu: "فاطمہ کڑاہی",
  tagline: "Flavours straight from Pakistan.",
  // SEO audit High #7 / on-page: rewritten to lead with "halal Pakistani
  // restaurant in Edmonton" (was missing "restaurant" entirely) and add
  // "biryani" for content depth — same facts, shared by the default <title>/
  // meta description (layout.tsx) and the Restaurant JSON-LD description.
  description:
    "Fatima Karahi is a halal Pakistani restaurant in Edmonton: slow-cooked karahi, charcoal BBQ, and biryani. Family-owned, catering daawats across the city.",

  // Production domain (used for canonical URLs, OG, sitemap, JSON-LD)
  url: "https://fatimakarahiyeg.com",

  // Real ordering-platform URL (Loop POS). Every "Order online" button
  // across the site reads this one value via hasOrderUrl()/orderUrl — set
  // once here, wired everywhere.
  orderUrl: "https://order.loopos.ca/fatima-karahi-corner-AB-CLG/menu",

  phone: "(780) 705-5000",
  phoneHref: "tel:+17807055000",

  address: {
    street: "10680 Ellerslie Rd SW",
    city: "Edmonton",
    region: "AB",
    postalCode: "T6W 0C3",
    country: "CA",
    // Pulled from the embedded Google Maps iframe already on /contact — same
    // coordinates, just not previously surfaced in LocalBusiness schema
    // (SEO audit High #4).
    lat: 53.4254,
    lng: -113.5031,
  },
  // Real CID deep link to the verified GBP listing embedded on /contact
  // (decoded from that same iframe's place ID: 0xea952bc0ce5712f9 → decimal),
  // not a generic text search — resolves to this exact location, not a
  // disambiguation page (SEO audit Medium #4). Still under the GBP's current
  // "Fatima Karahi Corner" name pending the client's rename (see AUDIT.md);
  // the CID itself doesn't change when that listing is renamed.
  mapsUrl: "https://www.google.com/maps?cid=16903464883500552953",

  hours: {
    display: "Mon–Fri · 1pm – 11pm, Sat–Sun · 11am – 11pm",
    /** schema.org OpeningHoursSpecification */
    schema: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "13:00",
        closes: "23:00",
      },
      {
        days: ["Saturday", "Sunday"],
        opens: "11:00",
        closes: "23:00",
      },
    ],
  },

  email: "Fatimarestaurantedmonton@gmail.com",

  // Real social profiles, confirmed by the client Aug 30, 2026 — both the
  // on-page footer link and the JSON-LD `sameAs` array read these same
  // values (empty string = link hidden), so this is the one place to edit.
  socials: {
    instagram: "https://www.instagram.com/fatimakarahi.yeg/",
    facebook: "https://www.facebook.com/fatimakarahi.yeg/",
    tiktok: "",
  },

  /** Real Google Business Profile rating, confirmed by the client Aug 26, 2026 (SEO audit High #3). */
  rating: { value: 4.4, count: 1231 },

  /** Trust stats — TODO(client): confirm the numbers */
  stats: [
    { value: 12, suffix: "+", label: "Years serving" },
    { value: 800, suffix: "+", label: "Daawats catered" },
    { value: 60, suffix: "+", label: "Dishes on the menu" },
  ],

  /** Stated response-time promise, used across catering + forms */
  replyPromise: "We reply within 4 hours",

  /**
   * TODO(client): these are real Google Business Profile reviews, lightly
   * trimmed for the large pull-quote treatment (full original text kept
   * alongside for reference) — confirm you're good with displaying each
   * reviewer's name publicly before this ships; pull real photos to replace
   * the initials avatars if/when you have them.
   */
  reviews: [
    {
      name: "Meju Ajmeri",
      city: "Edmonton",
      quote:
        "The food was absolutely delicious: everything fresh, flavorful, and well prepared. Thank you, Mariyum, for your kindness and hospitality!",
      fullQuote:
        "Today we ate at Fatima Karahi Restaurant, and the food was absolutely delicious. Everything was fresh, flavorful, and well prepared. We also received excellent customer service from Mariyum. She was very friendly, attentive, and made sure we had a great dining experience. Thank you, Mariyum, for your kindness and hospitality. We will definitely visit again!",
    },
    {
      name: "Sabanaaz Baig",
      city: "Edmonton",
      quote:
        "Alhamdulillah, excellent experience every time! The ambiance is bright, beautiful, and sophisticated.",
      fullQuote:
        "I have been here several times and Alhamdulillah, excellent experience everytime! Their ambiance is very pleasant, bright with lots of natural light (during the day of course) where pictures turns out amazing, beautiful and sophisticated interiors!",
    },
    {
      name: "Umer Shahzaib",
      city: "Edmonton",
      quote:
        "The karahi was out of this world and the kebabs were tender; it reminded me of the taste back home.",
      fullQuote:
        "The food was delicious, cooked fresh, and the taste was amazing. Karahi was out of this world and the kheer was too, the kebabs were tender — props to the chef. The staff was professional and trained. This is my go-to place for desi food and I'm going to recommend it to everyone I know. Reminded me of the taste back home.",
    },
  ],
} as const;

export type Site = typeof site;

/** True once the client's real ordering URL is set. */
export function hasOrderUrl(): boolean {
  return site.orderUrl.startsWith("http");
}

