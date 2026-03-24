import type { Block } from 'payload'

export const HighlightPointsBlock: Block = {
  slug: 'highlightPointsBlock',
  interfaceName: 'HighlightPointsBlockType',
  labels: {
    singular: 'Highlight Points Block',
    plural: 'Highlight Points Blocks',
  },
  fields: [
    {
      name: 'points',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
