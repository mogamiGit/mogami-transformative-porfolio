import type { Block } from 'payload'

export const HighlightPointsBlock: Block = {
  slug: 'highlightPointsBlock',
  interfaceName: 'HighlightPointsBlockType',
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
  labels: {
    plural: 'Highlight Points Blocks',
    singular: 'Highlight Points Block',
  },
}
