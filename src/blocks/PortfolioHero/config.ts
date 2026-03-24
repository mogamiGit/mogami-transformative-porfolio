import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PortfolioHero: Block = {
  slug: 'portfolioHero',
  interfaceName: 'PortfolioHeroBlock',
  labels: {
    singular: 'Portfolio Hero',
    plural: 'Portfolio Heroes',
  },
  fields: [
    {
      name: 'tagText',
      type: 'text',
      defaultValue: 'Open to Work',
    },
    {
      name: 'tagEmoji',
      type: 'text',
      defaultValue: '👩‍💻',
    },
    {
      name: 'role',
      type: 'text',
      defaultValue: 'Freelance Graphic Designer · Front-End Dev',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Hi, my name is Mónica Galán',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
