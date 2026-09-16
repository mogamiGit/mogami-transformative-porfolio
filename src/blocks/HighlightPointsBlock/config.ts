import type { Block } from 'payload'

export const HighlightPointsBlock: Block = {
  slug: 'highlightPointsBlock',
  interfaceName: 'HighlightPointsBlockType',
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Small label shown above title (e.g. "type: metrics")',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Section heading (e.g. "highlights.log")',
      },
    },
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
