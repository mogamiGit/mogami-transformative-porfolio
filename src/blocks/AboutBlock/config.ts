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
  ],
  labels: {
    plural: 'About Blocks',
    singular: 'About Block',
  },
}
