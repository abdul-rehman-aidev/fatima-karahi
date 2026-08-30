import type { Dish, MenuCategory, MenuSectionImage } from "@/sanity/types";

/**
 * "Must Try" pick list for the homepage carousel — a curated 5-dish rail
 * (not "whatever happens to be signature"). Kept in its own plain module
 * (no "use client") so it can be called from the server component that
 * fetches the menu — SpecialsCarousel.tsx is a client component, and a
 * function exported from a "use client" file can't be invoked server-side.
 */
const MUST_TRY_NAMES = ["Beef Nehari", "Chapli Kebab", "Khoya Kheer", "Chicken Biryani", "Chicken Wings"];

export type MustTryDish = Dish & { categoryImage?: MenuSectionImage | null };

export function pickMustTryDishes(categories: MenuCategory[]): MustTryDish[] {
  const dishes: MustTryDish[] = [];
  for (const name of MUST_TRY_NAMES) {
    for (const category of categories) {
      const dish = category.dishes?.find((d) => d.name === name);
      if (dish) {
        dishes.push({ ...dish, categoryImage: category.sectionImage });
        break;
      }
    }
  }
  return dishes;
}
