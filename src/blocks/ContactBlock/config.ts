import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlockType',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'linkedinLabel',
      type: 'text',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
    },
  ],
  labels: {
    plural: 'Contact Blocks',
    singular: 'Contact Block',
  },
}
