import type { Block } from 'payload'

export const GitHubRadarBlock: Block = {
  slug: 'githubRadarBlock',
  interfaceName: 'GitHubRadarBlockType',
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'type: github-radar',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'skills.radar',
    },
    {
      name: 'maxSkills',
      type: 'number',
      min: 4,
      max: 12,
      defaultValue: 8,
      admin: {
        description: 'Number of top skills to display (4-12)',
      },
    },
    {
      name: 'showMetrics',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show repo count and byte stats below chart',
      },
    },
  ],
  labels: {
    plural: 'GitHub Radar Blocks',
    singular: 'GitHub Radar Block',
  },
}
