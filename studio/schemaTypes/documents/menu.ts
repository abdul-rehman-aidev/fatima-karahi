import {MenuIcon} from '@sanity/icons/Menu'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({type: 'menuCategory'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {categories: 'categories'},
    prepare: ({categories}) => ({
      title: 'Menu',
      subtitle: Array.isArray(categories) ? `${categories.length} categories` : undefined,
    }),
  },
})
