import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'featured', 'publishedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'buttons',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: ['external', 'pencil'],
        },
      ],
    },
    {
      name: 'repositoryLink',
      type: 'text',
      required: false,
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'hasDetailPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable detail page at /projects/[slug]',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    slugField(),
  ],
}
