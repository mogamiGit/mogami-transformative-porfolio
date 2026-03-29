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
    defaultColumns: ['title', 'featured', 'order', 'publishedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
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
          options: ['github', 'external', 'figma'],
        },
      ],
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
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'year',
      type: 'text',
    },
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'detailDescription',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'emoji',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'carousel',
      type: 'array',
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'mediaType',
          type: 'select',
          options: ['image', 'video'],
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description: 'URL to video file (for videos not uploaded to media)',
          },
        },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'External URL for the project (e.g., live site)',
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
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
      name: 'publishedAt',
      type: 'date',
    },
    slugField(),
  ],
}
