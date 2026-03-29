import React from 'react'

import type { ExperienceBlockType } from '@/payload-types'

export const ExperienceBlockComponent: React.FC<ExperienceBlockType> = ({ sectionTitle }) => {
  return (
    <section className="container py-16">
      {sectionTitle && <h2 className="text-2xl font-bold mb-8">{sectionTitle}</h2>}
    </section>
  )
}
