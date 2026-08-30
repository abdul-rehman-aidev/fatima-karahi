import {DoubleQuoteIcon} from '@sanity/icons/DoubleQuote'
import {defineField, defineType} from 'sanity'
import {galleryRoleList} from '../shared/galleryRole'

export const galleryQuoteTile = defineType({
  name: 'galleryQuoteTile',
  title: 'Quote',
  type: 'object',
  icon: DoubleQuoteIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
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
    select: {text: 'text', role: 'role'},
    prepare: ({text, role}) => ({
      title: text,
      subtitle: role,
    }),
  },
})
