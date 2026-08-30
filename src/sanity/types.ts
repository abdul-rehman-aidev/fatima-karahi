import type { GALLERY_QUERY_RESULT, MENU_QUERY_RESULT } from "../../sanity.types";

type MenuData = NonNullable<MENU_QUERY_RESULT>;
type MenuCategoriesArray = Extract<MenuData, { categories: unknown }>["categories"];

export type MenuCategory = NonNullable<MenuCategoriesArray>[number];
export type Dish = NonNullable<MenuCategory["dishes"]>[number];
export type PriceTier = NonNullable<Dish["priceTiers"]>[number];
export type MenuSectionImage = NonNullable<MenuCategory["sectionImage"]>;

type GalleryData = NonNullable<GALLERY_QUERY_RESULT>;
type GalleryTilesArray = Extract<GalleryData, { tiles: unknown }>["tiles"];

export type GalleryTile = NonNullable<GalleryTilesArray>[number];
export type GalleryPhotoTile = Extract<GalleryTile, { _type: "galleryPhotoTile" }>;
export type GalleryQuoteTile = Extract<GalleryTile, { _type: "galleryQuoteTile" }>;
export type GalleryRole = GalleryTile["role"];
/** Shared shape for any Sanity image reference rendered via SanityPicture (alt is always passed as its own prop). */
export type SanityImageRef = MenuSectionImage;
