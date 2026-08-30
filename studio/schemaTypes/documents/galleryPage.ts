import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const galleryPage = defineType({
  name: 'galleryPage',
  title: 'Gallery',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'tiles',
      title: 'Tiles',
      description: 'Photos and quote cards, in display order. Drag to reorder.',
      type: 'array',
      of: [defineArrayMember({type: 'galleryPhotoTile'}), defineArrayMember({type: 'galleryQuoteTile'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {tiles: 'tiles'},
    prepare: ({tiles}) => ({
      title: 'Gallery',
      subtitle: Array.isArray(tiles) ? `${tiles.length} tiles` : undefined,
    }),
  },
})
