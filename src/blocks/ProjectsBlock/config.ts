import type { Block } from 'payload'

export const ProjectsBlock: Block = {
  slug: 'projectsBlock',
  interfaceName: 'ProjectsBlockType',
  labels: {
    singular: 'Projects Block',
    plural: 'Projects Blocks',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'projects',
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
    },
  ],
}
