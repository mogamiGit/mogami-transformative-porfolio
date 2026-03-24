import React from 'react'
import type { HighlightPointsBlockType } from '@/payload-types'
import { HighlightedTitle } from '@/components/atoms/HighlightedTitle'

export const HighlightPointsBlockComponent: React.FC<HighlightPointsBlockType> = (props) => {
  const { points } = props

  if (!points || points.length === 0) return null

  return (
    <section className="container py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
        {points.map((point, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="hidden md:block w-px h-12 bg-border mx-8" />
            )}
            <HighlightedTitle title={point.title} subtitle={point.subtitle} />
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
