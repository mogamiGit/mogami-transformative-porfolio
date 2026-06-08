import React from 'react'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import type { SkillsBlockType } from '@/payload-types'
import { SkillsList } from './Component.client'

export const SkillsBlockComponent: React.FC<SkillsBlockType> = async ({
  label,
  title,
  category,
}) => {
  const payload = await getPayloadClient()

  const query: Parameters<typeof payload.find>[0] = {
    collection: 'skills',
    sort: 'order',
    pagination: false,
  }

  if (category && category !== 'all') {
    query.where = {
      category: { equals: category },
    }
  }

  const { docs: skills } = await payload.find(query)

  return <SkillsList label={label} title={title} items={skills} />
}
