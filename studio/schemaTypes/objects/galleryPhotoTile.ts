import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'
import {galleryRoleList} from '../shared/galleryRole'

export const galleryPhotoTile = defineType({
  name: 'galleryPhotoTile',
  title: 'Photo',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          description: 'Also doubles as the photo caption. Describe what the photo shows.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Layout size',
      type: 'string',
      options: {list: galleryRoleList},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {media: 'image', alt: 'image.alt', role: 'role'},
    prepare: ({media, alt, role}) => ({
      title: alt || 'Untitled photo',
      subtitle: role,
      media,
    }),
  },
})
