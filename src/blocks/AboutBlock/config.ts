import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const AboutBlock: Block = {
  slug: 'aboutBlock',
  interfaceName: 'AboutBlockType',
  labels: {
    singular: 'About Block',
    plural: 'About Blocks',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'about_me',
    },
    {
      name: 'bio',
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
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
