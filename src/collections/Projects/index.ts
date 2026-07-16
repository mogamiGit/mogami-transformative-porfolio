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
      name: 'overview',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'Brief summary of the project — what it is and why it matters',
      },
    },
    {
      name: 'problem',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'What problem does this project solve?',
      },
    },
    {
      name: 'whatIBuilt',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'Features and functionality implemented',
      },
    },
    {
      name: 'technicalDecisions',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'Why specific technologies/patterns were chosen',
      },
    },
    {
      name: 'constraints',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'Limitations and restrictions the project had to work within',
      },
    },
    {
      name: 'outcome',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'Results, impact, metrics',
      },
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
      name: 'githubRepo',
      type: 'text',
      admin: {
        description: 'GitHub repo path, e.g. "mogamiGit/repo-name"',
      },
    },
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'completed',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Maintained', value: 'maintained' },
        { label: 'Archived', value: 'archived' },
        { label: 'Planned', value: 'planned' },
      ],
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
