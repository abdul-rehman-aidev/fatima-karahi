import type {
  CATERING_PACKAGES_QUERY_RESULT,
  GALLERY_QUERY_RESULT,
  MENU_QUERY_RESULT,
  SITE_PHOTOS_QUERY_RESULT,
} from "../../sanity.types";

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

type SitePhotosData = NonNullable<SITE_PHOTOS_QUERY_RESULT>;
type SitePhotosArray = Extract<SitePhotosData, { photos: unknown }>["photos"];

export type SitePhoto = NonNullable<SitePhotosArray>[number];

/** Keyed lookup for the shared "Site Photos" pool, e.g. pool["hero-carousel-1"]. */
export type SitePhotoPool = Record<string, SitePhoto | undefined>;

/**
 * A missing or duplicate key degrades gracefully (dropped / last-wins) rather
 * than throwing, so an incomplete Site Photos document in Studio never
 * breaks the build — the affected image is just omitted.
 */
export function buildSitePhotoPool(photos: SitePhoto[] | null | undefined): SitePhotoPool {
  const pool: SitePhotoPool = {};
  for (const photo of photos ?? []) {
    if (photo.key) pool[photo.key] = photo;
  }
  return pool;
}

type CateringPackagesData = NonNullable<CATERING_PACKAGES_QUERY_RESULT>;
type CateringPackagesArray = Extract<CateringPackagesData, { packages: unknown }>["packages"];

export type CateringPackage = NonNullable<CateringPackagesArray>[number];
