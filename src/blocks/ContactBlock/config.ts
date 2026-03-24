import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlockType',
  labels: {
    singular: 'Contact Block',
    plural: 'Contact Blocks',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'contact',
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
}
