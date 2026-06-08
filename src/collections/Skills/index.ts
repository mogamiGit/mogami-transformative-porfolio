import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'skillType', 'category', 'order'],
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
      options: [
        { label: 'Hard skill', value: 'hard' },
        { label: 'Soft skill', value: 'soft' },
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
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
    },
  ],
}
