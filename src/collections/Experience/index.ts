import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Experience: CollectionConfig = {
  slug: 'experience',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['organization', 'role', 'type', 'period', 'order'],
    useAsTitle: 'role',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Work', value: 'work' },
        { label: 'Education', value: 'education' },
      ],
    },
    {
      name: 'period',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "2020 - 2023" or "2024"',
      },
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'order',
      type: 'number',
    },
  ],
}
