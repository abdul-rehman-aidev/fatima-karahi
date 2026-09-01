import {TiersIcon} from '@sanity/icons/Tiers'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const cateringPackages = defineType({
  name: 'cateringPackages',
  title: 'Catering Packages',
  type: 'document',
  icon: TiersIcon,
  fields: [
    defineField({
      name: 'packages',
      title: 'Packages',
      description: 'Set-menu packages, in display order. Drag to reorder.',
      type: 'array',
      of: [defineArrayMember({type: 'cateringPackage'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {packages: 'packages'},
    prepare: ({packages}) => ({
      title: 'Catering Packages',
      subtitle: Array.isArray(packages) ? `${packages.length} packages` : undefined,
    }),
  },
})
