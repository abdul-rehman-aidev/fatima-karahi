/**
 * Site-wide facts — THE single file to edit when real client values arrive.
 * Every TODO(client) below is a placeholder carried over from the design
 * reference; nothing else in the codebase hard-codes these values.
 */

export const site = {
  name: "Fatima Karahi",
  nameUrdu: "فاطمہ کڑاہی",
  tagline: "Flavours straight from Lahore.",
  description:
    "The taste of Lahore, now in Edmonton: slow-cooked karahi, charcoal BBQ, and the warmth of a Lahori dastarkhwan. Halal, family-owned, catering daawats across Edmonton.",

  // TODO(client): production domain (used for canonical URLs, OG, sitemap, JSON-LD)
  url: "https://fatimakarahi.ca",

  // Real ordering-platform URL (Loop POS). Every "Order online" button
  // across the site reads this one value via hasOrderUrl()/orderUrl — set
  // once here, wired everywhere.
  orderUrl: "https://food.loopos.ca/?id=65d82147b3ee6659279e36da&slug=fatima-karahi-corner-edmonton-mzxkst",

  phone: "(780) 705-5000",
  phoneHref: "tel:+17807055000",
  // No separate WhatsApp number given — this field mirrored `phone` as a
  // placeholder before, so it's updated to the same real number (with the
  // +1 country code — waHref() strips this to digits-only for the wa.me
  // link, which needs the country code to resolve correctly). Flag if
  // WhatsApp should actually go to a different line.
  whatsapp: "+1 (780) 705-5000",

  address: {
    street: "10680 Ellerslie Rd SW",
    city: "Edmonton",
    region: "AB",
    postalCode: "T6W 0C3",
    country: "CA",
  },
  // TODO(client): Google Maps listing URL for the "Open in Maps" link
  mapsUrl: "https://maps.google.com/?q=Fatima+Karahi+Edmonton",

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

  email: "hello@fatimakarahi.ca", // TODO(client)

  // TODO(client): real social profiles (empty string = link hidden)
  socials: {
    instagram: "https://instagram.com/fatimakarahi",
    facebook: "https://facebook.com/fatimakarahi",
    tiktok: "",
  },

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

export function waHref(): string {
  return `https://wa.me/${site.whatsapp.replace(/[^\d]/g, "")}`;
}
