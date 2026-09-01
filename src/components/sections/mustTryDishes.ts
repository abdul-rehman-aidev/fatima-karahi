import type { Dish, MenuCategory, MenuSectionImage } from "@/sanity/types";

/**
 * "Must Try" pick list for the homepage carousel — a curated dish rail
 * (not "whatever happens to be signature"). Curation now lives in Sanity:
 * editors tick "Featured on homepage" on a dish and set "Featured order" to
 * control its position in the rail. Kept in its own plain module (no
 * "use client") so it can be called from the server component that fetches
 * the menu — SpecialsCarousel.tsx is a client component, and a function
 * exported from a "use client" file can't be invoked server-side.
 */
export type MustTryDish = Omit<Dish, "image"> & { image?: MenuSectionImage | null };

export function pickMustTryDishes(categories: MenuCategory[]): MustTryDish[] {
  const dishes: MustTryDish[] = [];
  for (const category of categories) {
    for (const dish of category.dishes ?? []) {
      // A dish's own photo wins; the category's section photo is only a
      // fallback for dishes featured before anyone uploaded one.
      if (dish.featured) dishes.push({ ...dish, image: dish.image ?? category.sectionImage });
    }
  }
  return dishes.sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity));
}
