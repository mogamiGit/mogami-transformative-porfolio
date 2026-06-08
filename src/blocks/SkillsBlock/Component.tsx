import React from 'react'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import type { SkillsBlockType } from '@/payload-types'
import type { Where } from 'payload'
import { SkillsList } from './Component.client'

export const SkillsBlockComponent: React.FC<SkillsBlockType> = async ({
  label,
  title,
  category,
}) => {
  const payload = await getPayloadClient()

  const where: Where =
    category && category !== 'all' ? { category: { equals: category } } : {}

  const { docs: skills } = await payload.find({
    collection: 'skills',
    sort: 'order',
    pagination: false,
    where,
  })

  return <SkillsList label={label} title={title} items={skills} />
}
