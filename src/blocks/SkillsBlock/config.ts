import type { Block } from 'payload'

export const SkillsBlock: Block = {
  slug: 'skillsBlock',
  interfaceName: 'SkillsBlockType',
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'type: skills',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'skills.log',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Languages', value: 'languages' },
        { label: 'Frameworks', value: 'frameworks' },
        { label: 'Tools', value: 'tools' },
      ],
    },
  ],
  labels: {
    plural: 'Skills Blocks',
    singular: 'Skills Block',
  },
}
