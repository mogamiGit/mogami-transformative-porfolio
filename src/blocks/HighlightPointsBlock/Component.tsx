import React from 'react'

import type { HighlightPointsBlockType } from '@/payload-types'

export const HighlightPointsBlockComponent: React.FC<HighlightPointsBlockType> = ({ points }) => {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {points?.map((point) => (
          <div key={point.id} className="flex flex-col gap-2">
            <span className="text-3xl font-bold">{point.title}</span>
            <span className="text-muted-foreground">{point.subtitle}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
