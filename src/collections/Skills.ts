import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'category', 'skillType', 'order'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'skillType',
      type: 'select',
      defaultValue: 'hard',
      options: [
        { label: 'Hard Skill', value: 'hard' },
        { label: 'Soft Skill', value: 'soft' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Languages', value: 'languages' },
        { label: 'Frameworks', value: 'frameworks' },
        { label: 'Patterns', value: 'patterns' },
        { label: 'Tools', value: 'tools' },
        { label: 'Methodologies', value: 'methodologies' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.skillType === 'hard',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
