import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const sitePhotos = defineType({
  name: 'sitePhotos',
  title: 'Site Photos',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'photos',
      title: 'Photos',
      description: 'Every marketing photo used across the site (hero, about, catering), keyed by placement.',
      type: 'array',
      of: [defineArrayMember({type: 'sitePhoto'})],
      validation: (rule) =>
        rule.min(1).custom((photos) => {
          const keys = ((photos ?? []) as Array<{key?: string}>).map((photo) => photo.key).filter(Boolean)
          return keys.length === new Set(keys).size ? true : 'Each key must be unique.'
        }),
    }),
  ],
  preview: {
    select: {photos: 'photos'},
    prepare: ({photos}) => ({
      title: 'Site Photos',
      subtitle: Array.isArray(photos) ? `${photos.length} photos` : undefined,
    }),
  },
})
