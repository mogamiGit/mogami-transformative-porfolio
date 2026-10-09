import React from 'react'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import type { ProjectsBlockType } from '@/payload-types'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { ProjectsGrid } from './Component.client'

export const ProjectsBlockComponent: React.FC<ProjectsBlockType> = async ({
  sectionTitle,
  showFeaturedOnly,
  limit,
}) => {
  const payload = await getPayloadClient()

  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: '-publishedAt',
    pagination: false,
    overrideAccess: false,
    ...(showFeaturedOnly ? { where: { featured: { equals: true } } } : {}),
    ...(limit ? { limit } : {}),
  })

  return (
    <section id="projects" className="container py-16 px-8 border-b border-border">
      <SectionHeader
        title={sectionTitle || 'projects'}
        aside={`ls ./projects · ${projects.length} entries`}
      />

      <ProjectsGrid projects={projects} />
    </section>
  )
}
