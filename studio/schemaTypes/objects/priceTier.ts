import {defineField, defineType} from 'sanity'

export const priceTier = defineType({
  name: 'priceTier',
  title: 'Price tier',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'e.g. "½ kg", "1 kg", "Half", "Full"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (CAD)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
  ],
  preview: {
    select: {label: 'label', price: 'price'},
    prepare: ({label, price}) => ({
      title: label,
      subtitle: typeof price === 'number' ? `$${price.toFixed(2)}` : undefined,
    }),
  },
})
