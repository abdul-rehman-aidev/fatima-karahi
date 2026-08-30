import {galleryPage} from './documents/galleryPage'
import {menu} from './documents/menu'
import {dish} from './objects/dish'
import {galleryPhotoTile} from './objects/galleryPhotoTile'
import {galleryQuoteTile} from './objects/galleryQuoteTile'
import {menuCategory} from './objects/menuCategory'
import {priceTier} from './objects/priceTier'

export const schemaTypes = [
  // Documents
  menu,
  galleryPage,
  // Objects
  menuCategory,
  dish,
  priceTier,
  galleryPhotoTile,
  galleryQuoteTile,
]
