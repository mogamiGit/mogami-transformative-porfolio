import React from 'react'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import type { ExperienceBlockType } from '@/payload-types'
import { ExperienceList } from './Component.client'

export const ExperienceBlockComponent: React.FC<ExperienceBlockType> = async ({ sectionTitle }) => {
  const payload = await getPayloadClient()

  const { docs: experience } = await payload.find({
    collection: 'experience',
    sort: 'order',
    pagination: false,
  })

  return (
    <section className="container py-16">
      {sectionTitle && <h2 className="text-2xl font-bold mb-8">{sectionTitle}</h2>}
      <ExperienceList items={experience} />
    </section>
  )
}
