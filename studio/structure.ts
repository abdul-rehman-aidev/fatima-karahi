import {ImagesIcon} from '@sanity/icons/Images'
import {MenuIcon} from '@sanity/icons/Menu'
import {TiersIcon} from '@sanity/icons/Tiers'
import type {StructureResolver} from 'sanity/structure'

/**
 * `menu`, `galleryPage`, `sitePhotos`, and `cateringPackages` are singletons
 * (one document each, fixed `_id`). List them directly instead of through
 * the generic per-type document list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Menu')
        .icon(MenuIcon)
        .child(S.document().schemaType('menu').documentId('menu')),
      S.listItem()
        .title('Gallery')
        .icon(ImagesIcon)
        .child(S.document().schemaType('galleryPage').documentId('galleryPage')),
      S.listItem()
        .title('Site Photos')
        .icon(ImagesIcon)
        .child(S.document().schemaType('sitePhotos').documentId('sitePhotos')),
      S.listItem()
        .title('Catering Packages')
        .icon(TiersIcon)
        .child(S.document().schemaType('cateringPackages').documentId('cateringPackages')),
    ])
