import {ListIcon} from '@sanity/icons/List'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu category',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'categoryId',
      title: 'Category ID',
      description: 'Short, URL-safe id used for the on-page section link, e.g. "chicken-karahi". Lowercase, hyphens only.',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/, {name: 'lowercase-hyphenated'})
          .error('Lowercase letters, numbers, and hyphens only'),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'urdu',
      title: 'Urdu label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      description: 'e.g. "Weekends only, 11am to 2pm."',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'sectionImage',
      title: 'Section photo',
      description: 'One photo shown for this category, not per dish.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'dishes',
      title: 'Dishes',
      type: 'array',
      of: [defineArrayMember({type: 'dish'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'label', dishes: 'dishes'},
    prepare: ({title, dishes}) => ({
      title,
      subtitle: Array.isArray(dishes) ? `${dishes.length} dish${dishes.length === 1 ? '' : 'es'}` : undefined,
    }),
  },
})
