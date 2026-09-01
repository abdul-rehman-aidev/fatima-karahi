import {defineArrayMember, defineField, defineType} from 'sanity'

export const dish = defineType({
  name: 'dish',
  title: 'Dish',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'urdu',
      title: 'Urdu name',
      type: 'string',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'price',
      title: 'Price (CAD)',
      type: 'number',
      description: 'Use this for a single flat price. Leave empty if this dish uses price tiers instead.',
      validation: (rule) =>
        rule.positive().custom((price, context) => {
          const parent = context.parent as {priceTiers?: unknown[]} | undefined
          const hasTiers = Array.isArray(parent?.priceTiers) && parent.priceTiers.length > 0
          if (price === undefined && !hasTiers) return 'Set either a price or at least one price tier'
          if (price !== undefined && hasTiers) return 'Set a price or price tiers, not both'
          return true
        }),
    }),
    defineField({
      name: 'priceTiers',
      title: 'Price tiers',
      type: 'array',
      of: [defineArrayMember({type: 'priceTier'})],
      description: 'Use this for dishes priced by portion (e.g. ½ kg / 1 kg). Leave empty if using a flat price.',
    }),
    defineField({
      name: 'spice',
      title: 'Spice level',
      type: 'number',
      options: {
        list: [
          {title: 'Mild', value: 0},
          {title: 'Medium', value: 1},
          {title: 'Hot', value: 2},
          {title: 'Very hot', value: 3},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'signature',
      title: 'Signature dish',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      description:
        'Used as the card photo when this dish is featured on the homepage. Falls back to the menu category\'s section photo if left empty.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      description:
        'Shows this dish in the "Must Try" carousel on the homepage. Requires a flat price — dishes priced by tiers can\'t be featured.',
      type: 'boolean',
      initialValue: false,
      validation: (rule) =>
        rule.custom((featured, context) => {
          const parent = context.parent as {priceTiers?: unknown[]} | undefined
          const hasTiers = Array.isArray(parent?.priceTiers) && parent.priceTiers.length > 0
          if (featured && hasTiers) return "Featured dishes need a flat price — this dish uses price tiers"
          return true
        }),
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured order',
      description: 'Position in the homepage carousel (lower numbers first). Only used when "Featured on homepage" is on.',
      type: 'number',
      hidden: ({parent}) => !parent?.featured,
      validation: (rule) => rule.integer().positive(),
    }),
  ],
  preview: {
    select: {name: 'name', price: 'price', tiers: 'priceTiers', featured: 'featured', media: 'image'},
    prepare: ({name, price, tiers, featured, media}) => ({
      title: name,
      subtitle: [
        typeof price === 'number'
          ? `$${price.toFixed(2)}`
          : Array.isArray(tiers) && tiers.length
            ? `${tiers.length} price tier${tiers.length > 1 ? 's' : ''}`
            : 'No price set',
        featured ? 'Featured' : undefined,
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
