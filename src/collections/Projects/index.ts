import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateProject, revalidateDeleteProject } from './hooks/revalidateProject'
import { slugField } from 'payload'
import {
  MetaTitleField,
  MetaImageField,
  MetaDescriptionField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'featured', 'order', 'updatedAt'],
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
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'External', value: 'external' },
            { label: 'Figma', value: 'figma' },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Images',
          fields: [
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
          ],
        },
        {
          label: 'Detail',
          fields: [
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
                  type: 'textarea',
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
                  defaultValue: 'image',
                  options: [
                    { label: 'Image', value: 'image' },
                    { label: 'Video', value: 'video' },
                  ],
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    description: 'URL to video file (for videos not uploaded to media)',
                    condition: (_, siblingData) => siblingData?.mediaType === 'video',
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
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    // Sidebar fields
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hasDetailPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Enable detail page at /projects/[slug]',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDeleteProject],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
