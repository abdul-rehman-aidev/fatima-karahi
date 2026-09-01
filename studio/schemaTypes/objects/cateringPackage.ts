import {TiersIcon} from '@sanity/icons/Tiers'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const cateringPackage = defineType({
  name: 'cateringPackage',
  title: 'Package',
  type: 'object',
  icon: TiersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pricePerPerson',
      title: 'Price per person',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Highlights this package with a "Best Value" tag. Set on at most one package.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'items',
      title: 'Items',
      description: 'What this package includes, one item per line.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'name', price: 'pricePerPerson', featured: 'featured'},
    prepare: ({title, price, featured}) => ({
      title: title || 'Untitled package',
      subtitle: [price != null ? `$${price}/person` : undefined, featured ? 'Best Value' : undefined]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
