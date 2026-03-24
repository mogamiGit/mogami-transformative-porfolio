import type { Block } from 'payload'

export const ExperienceBlock: Block = {
  slug: 'experienceBlock',
  interfaceName: 'ExperienceBlockType',
  labels: {
    singular: 'Experience Block',
    plural: 'Experience Blocks',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'experience',
    },
  ],
}
