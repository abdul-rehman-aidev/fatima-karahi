import { site } from "@/data/site";
import type { MenuCategory } from "@/sanity/types";

/**
 * Restaurant + LocalBusiness JSON-LD with the Edmonton NAP, emitted site-wide
 * from the root layout. The full Menu schema is emitted on /menu (MenuJsonLd).
 */
export function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    alternateName: site.nameUrdu,
    description: site.description,
    url: site.url,
    // E.164 (SEO audit Medium #5) — derived from phoneHref so there's still
    // one source of truth, rather than a second hardcoded number that could
    // drift from site.phone.
    telephone: site.phoneHref.replace("tel:", ""),
    // Real client-supplied logo (SEO audit Medium #3 — schema had no `logo`
    // despite the asset already existing and being used site-wide in the nav).
    logo: `${site.url}/brand/fatima-logo.png`,
    servesCuisine: ["Pakistani", "Lahori", "Halal"],
    priceRange: "$$",
    image: `${site.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    // Real coordinates, pulled from the same GBP embed already on /contact
    // (SEO audit High #4 — schema had no geo block despite the exact
    // lat/long already sitting in the page's own Maps iframe URL).
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    hasMap: site.mapsUrl,
    // Real GBP rating, confirmed by the client (SEO audit High #3 — no
    // rating was surfaced anywhere despite a real ~4.4★ average existing).
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
    },
    openingHoursSpecification: site.hours.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: `${site.url}/menu/`,
    // Corrected from `true` (SEO audit High #2) — the online reservation
    // form was removed earlier in this build; the site now only offers
    // phone reservations, which this schema property can't represent, so
    // `false` is the honest value rather than a stale claim.
    acceptsReservations: false,
    // filter(Boolean) already drops the blanked-out instagram entry in
    // site.ts (was pointing at an unrelated, dormant account — SEO audit
    // "Still open" item) without needing a separate fix here.
    sameAs: Object.values(site.socials).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD (SEO audit Medium #1 — "no BreadcrumbList schema
 * anywhere, despite an ideal flat structure for it"). Every page on this
 * site is one level deep, so each breadcrumb is just Home → [page] — call
 * with a single { name, path } entry from each page.
 */
export function BreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name, item: `${site.url}${path}` },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Full Menu schema generated from the Sanity `menu` document — emitted on /menu. */
export function MenuJsonLd({ menu }: { menu: MenuCategory[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/menu/#menu`,
    name: `${site.name}: Menu`,
    inLanguage: "en",
    hasMenuSection: menu.map((cat) => ({
      "@type": "MenuSection",
      name: cat.label,
      hasMenuItem: (cat.dishes ?? []).map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        ...(d.desc ? { description: d.desc } : {}),
        // Tiered dishes (½ kg / 1 kg, Half / Full) used to collapse to a
        // single Offer at the first tier's price, silently dropping every
        // other tier (SEO audit Medium #2). An AggregateOffer with the real
        // low/high across all tiers represents the full priced range
        // instead of just the cheapest one.
        offers: d.priceTiers
          ? {
              "@type": "AggregateOffer",
              lowPrice: Math.min(...d.priceTiers.map((t) => t.price ?? 0)),
              highPrice: Math.max(...d.priceTiers.map((t) => t.price ?? 0)),
              offerCount: d.priceTiers.length,
              priceCurrency: "CAD",
            }
          : {
              "@type": "Offer",
              price: d.price ?? 0,
              priceCurrency: "CAD",
            },
      })),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
