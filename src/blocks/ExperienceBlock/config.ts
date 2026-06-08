import type { Block } from 'payload'

export const ExperienceBlock: Block = {
  slug: 'experienceBlock',
  interfaceName: 'ExperienceBlockType',
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'type: timeline',
      admin: {
        description: 'Small label shown above title (e.g. "type: timeline")',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'experience.log',
      admin: {
        description: 'Card title (e.g. "experience.log")',
      },
    },
    {
      name: 'experienceType',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Work', value: 'work' },
        { label: 'Education', value: 'education' },
      ],
      admin: {
        description: 'Filter experiences by type',
      },
    },
  ],
  labels: {
    plural: 'Experience Blocks',
    singular: 'Experience Block',
  },
}
