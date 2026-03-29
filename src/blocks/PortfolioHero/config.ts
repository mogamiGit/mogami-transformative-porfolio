import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const PortfolioHero: Block = {
  slug: 'portfolioHero',
  interfaceName: 'PortfolioHeroBlock',
  fields: [
    {
      name: 'tagText',
      type: 'text',
    },
    {
      name: 'tagEmoji',
      type: 'text',
    },
    {
      name: 'role',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Portfolio Heroes',
    singular: 'Portfolio Hero',
  },
}
