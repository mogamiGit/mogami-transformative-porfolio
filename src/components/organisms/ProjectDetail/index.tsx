import React from 'react'
import type { Project } from '@/payload-types'
import { HeaderDetail } from './HeaderDetail'
import { InfoDetail } from './InfoDetail'
import { DropdownCard } from './DropdownCard'
import { HorizontalScrollCarousel } from './HorizontalScrollCarousel'

interface ProjectDetailProps {
  project: Project
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const { title, headerImage, year, client, detailDescription, tags, externalUrl, highlights, carousel } =
    project

  return (
    <article className="pb-24">
      <HeaderDetail title={title} headerImage={headerImage} />

      <InfoDetail
        year={year || ''}
        client={client || ''}
        description={detailDescription}
        tags={tags?.map((t) => t.tag) || []}
        externalUrl={externalUrl || ''}
      />

      {highlights && highlights.length > 0 && (
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <DropdownCard
                key={index}
                title={highlight.title}
                description={highlight.description || ''}
                emoji={highlight.emoji || ''}
              />
            ))}
          </div>
        </section>
      )}

      {carousel && carousel.length > 0 && (
        <HorizontalScrollCarousel cards={carousel} />
      )}
    </article>
  )
}
