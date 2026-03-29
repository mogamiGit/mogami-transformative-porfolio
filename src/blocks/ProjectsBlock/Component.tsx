import React from 'react'

import type { ProjectsBlockType } from '@/payload-types'

export const ProjectsBlockComponent: React.FC<ProjectsBlockType> = ({ sectionTitle }) => {
  return (
    <section className="container py-16">
      {sectionTitle && <h2 className="text-2xl font-bold mb-8">{sectionTitle}</h2>}
    </section>
  )
}
