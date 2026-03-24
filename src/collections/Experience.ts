import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Experience: CollectionConfig = {
  slug: 'experience',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['organization', 'role', 'type', 'period', 'order'],
    useAsTitle: 'organization',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Education', value: 'education' },
        { label: 'Work', value: 'work' },
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
