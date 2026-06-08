import type { Block } from 'payload'

export const ExperienceBlock: Block = {
  slug: 'experienceBlock',
  interfaceName: 'ExperienceBlockType',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
    },
  ],
  labels: {
    plural: 'Experience Blocks',
    singular: 'Experience Block',
  },
}
