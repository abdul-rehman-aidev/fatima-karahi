import { site } from "@/data/site";
import { menu } from "@/data/menu";

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
    telephone: site.phone,
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
    openingHoursSpecification: site.hours.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: `${site.url}/menu/`,
    acceptsReservations: true,
    sameAs: Object.values(site.socials).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Full Menu schema generated from data/menu.ts — emitted on /menu. */
export function MenuJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/menu/#menu`,
    name: `${site.name}: Menu`,
    inLanguage: "en",
    hasMenuSection: menu.map((cat) => ({
      "@type": "MenuSection",
      name: cat.label,
      hasMenuItem: cat.dishes.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        ...(d.desc ? { description: d.desc } : {}),
        offers: {
          "@type": "Offer",
          // Tiered dishes (½ kg / 1 kg, Half / Full) have no single `price` —
          // fall back to the first tier as the "starting from" figure.
          price: (d.price ?? d.priceTiers?.[0]?.price ?? "").replace(/[^0-9.]/g, ""),
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
