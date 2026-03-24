import React from 'react'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import type { ProjectsBlockType } from '@/payload-types'
import { TitleSection } from '@/components/atoms/TitleSection'
import { ProjectCard } from '@/components/molecules/ProjectCard'

export const ProjectsBlockComponent: React.FC<ProjectsBlockType> = async (props) => {
  const { sectionTitle, showFeaturedOnly, limit } = props
  const payload = await getPayload({ config: configPromise })

  const where: Where = {
    _status: { equals: 'published' },
  }

  if (showFeaturedOnly) {
    where.featured = { equals: true }
  }

  const projects = await payload.find({
    collection: 'projects',
    where,
    sort: 'order',
    limit: limit || 10,
  })

  return (
    <section id="projects" className="container py-16">
      <TitleSection text={sectionTitle || 'projects'} />
      <div className="mt-8 flex flex-col">
        {projects.docs.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
