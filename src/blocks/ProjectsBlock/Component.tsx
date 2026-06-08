import React from 'react'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import type { ProjectsBlockType } from '@/payload-types'
import { ProjectsGrid } from './Component.client'

export const ProjectsBlockComponent: React.FC<ProjectsBlockType> = async ({
  sectionTitle,
  showFeaturedOnly,
  limit,
}) => {
  const payload = await getPayloadClient()

  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: 'order',
    pagination: false,
    overrideAccess: true,
    ...(showFeaturedOnly ? { where: { featured: { equals: true } } } : {}),
    ...(limit ? { limit } : {}),
  })

  return (
    <section id="projects" className="container py-16 px-8 border-b border-border">
      <div className="flex items-baseline gap-4 mb-8 pb-3 border-b border-dashed border-border">
        <span className="text-[11px] tabular-nums" style={{ color: 'var(--card-foreground)', opacity: 0.5 }}>
          03 / 07
        </span>
        <span
          className="text-[11px] tracking-widest uppercase font-mono"
          style={{ color: 'var(--primary)' }}
        >
          <span style={{ color: 'var(--card-foreground)', opacity: 0.4 }}> </span>
          {sectionTitle || 'projects'}
        </span>
        <span className="ml-auto text-[11px] font-mono" style={{ color: 'var(--card-foreground)', opacity: 0.4 }}>
          ls ./projects · {projects.length} entries
        </span>
      </div>

      <ProjectsGrid projects={projects} />
    </section>
  )
}
