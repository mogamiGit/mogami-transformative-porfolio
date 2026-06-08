import React from 'react'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import type { ExperienceBlockType } from '@/payload-types'
import { ExperienceCardList } from './Component.client'

export const ExperienceBlockComponent: React.FC<ExperienceBlockType> = async ({
  label,
  title,
  experienceType,
}) => {
  const payload = await getPayloadClient()

  const whereClause =
    experienceType && experienceType !== 'all' ? { type: { equals: experienceType } } : {}

  const { docs: experience } = await payload.find({
    collection: 'experience',
    sort: 'order',
    pagination: false,
    where: whereClause,
  })

  return <ExperienceCardList label={label} title={title} items={experience} />
}
