import type { Block } from 'payload'

export const GitHubStatsBlock: Block = {
  slug: 'githubStatsBlock',
  interfaceName: 'GitHubStatsBlockType',
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'type: github-stats',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'github.stats',
    },
    {
      name: 'months',
      type: 'select',
      defaultValue: '12',
      options: [
        { label: '6 months', value: '6' },
        { label: '12 months', value: '12' },
      ],
      admin: {
        description: 'Number of months to display in heatmap',
      },
    },
    {
      name: 'maxSkills',
      type: 'number',
      min: 4,
      max: 12,
      defaultValue: 8,
      admin: {
        description: 'Number of top skills to display in radar (4-12)',
      },
    },
    {
      name: 'showMetrics',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show repo count and byte stats below radar chart',
      },
    },
  ],
  labels: {
    plural: 'GitHub Stats Blocks',
    singular: 'GitHub Stats Block',
  },
}
