import type { Block } from 'payload'

export const ProjectsBlock: Block = {
  slug: 'projectsBlock',
  interfaceName: 'ProjectsBlockType',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
    },
  ],
  labels: {
    plural: 'Projects Blocks',
    singular: 'Projects Block',
  },
}
