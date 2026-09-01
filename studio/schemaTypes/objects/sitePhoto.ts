import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'
import {sitePhotoKeyList} from '../shared/sitePhotoKeys'

export const sitePhoto = defineType({
  name: 'sitePhoto',
  title: 'Photo',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      description: 'Which spot on the site this photo fills. Do not change once in use — the frontend looks photos up by this value.',
      type: 'string',
      options: {list: sitePhotoKeyList},
      validation: (rule) => rule.required(),
    }),
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
          description: 'Fallback description for Studio preview. Most placements on the site use their own tailored alt text instead.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional editorial note.',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      description: 'For organizing this list in the Studio only — not read by the site.',
      type: 'string',
      options: {list: ['hero', 'food', 'occasion', 'people', 'venue', 'moment']},
    }),
  ],
  preview: {
    select: {media: 'image', key: 'key', tag: 'tag'},
    prepare: ({media, key, tag}) => ({
      title: key || 'Untitled key',
      subtitle: tag,
      media,
    }),
  },
})
