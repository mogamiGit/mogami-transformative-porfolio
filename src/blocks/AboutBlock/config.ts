import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const AboutBlock: Block = {
  slug: 'aboutBlock',
  interfaceName: 'AboutBlockType',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'mantra',
      type: 'array',
      admin: {
        description:
          'Short steps shown as a looping sequence next to the bio, e.g. learn → design → repeat',
      },
      fields: [
        {
          name: 'step',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'About Blocks',
    singular: 'About Block',
  },
}
