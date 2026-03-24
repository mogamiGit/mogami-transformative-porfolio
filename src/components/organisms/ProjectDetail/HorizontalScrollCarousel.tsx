import React from 'react'
import type { Project } from '@/payload-types'
import { CardCarousel } from './CardCarousel'

interface HorizontalScrollCarouselProps {
  title?: string
  description?: string
  cards: NonNullable<Project['carousel']>
}

export const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({
  title,
  description,
  cards,
}) => {
  return (
    <section className="py-12">
      {(title || description) && (
        <div className="container mb-8">
          {title && <h3 className="text-2xl font-semibold">{title}</h3>}
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-[max(1rem,calc((100vw-86rem)/2+1rem))] snap-x snap-mandatory pb-4">
          {cards.map((card, index) => (
            <CardCarousel key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
