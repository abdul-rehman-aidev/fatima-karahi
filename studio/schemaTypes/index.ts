import {cateringPackages} from './documents/cateringPackages'
import {galleryPage} from './documents/galleryPage'
import {menu} from './documents/menu'
import {sitePhotos} from './documents/sitePhotos'
import {cateringPackage} from './objects/cateringPackage'
import {dish} from './objects/dish'
import {galleryPhotoTile} from './objects/galleryPhotoTile'
import {galleryQuoteTile} from './objects/galleryQuoteTile'
import {menuCategory} from './objects/menuCategory'
import {priceTier} from './objects/priceTier'
import {sitePhoto} from './objects/sitePhoto'

export const schemaTypes = [
  // Documents
  menu,
  galleryPage,
  sitePhotos,
  cateringPackages,
  // Objects
  menuCategory,
  dish,
  priceTier,
  galleryPhotoTile,
  galleryQuoteTile,
  sitePhoto,
  cateringPackage,
]
