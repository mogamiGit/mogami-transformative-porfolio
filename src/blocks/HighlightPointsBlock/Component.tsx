import React from 'react'

import type { HighlightPointsBlockType } from '@/payload-types'
import { HighlightCard } from '@/components/molecules/HighlightCard'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/utilities/ui'

/**
 * Column count derived from the number of points (research R6), so no count
 * leaves an orphaned card in a half-empty row.
 *
 * Every value is a complete literal class string on purpose: Tailwind v4 scans
 * source text, so an interpolated `grid-cols-${n}` would produce no CSS.
 */
const COLUMN_CLASSES: Record<number, string> = {
  1: 'grid-cols-1 max-w-xs',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3',
  6: 'grid-cols-2 md:grid-cols-3',
}

const FALLBACK_COLUMN_CLASS = 'grid-cols-2 md:grid-cols-4'

const columnClassFor = (count: number): string => COLUMN_CLASSES[count] ?? FALLBACK_COLUMN_CLASS

export const HighlightPointsBlockComponent: React.FC<HighlightPointsBlockType> = ({
  label,
  title,
  points,
}) => {
  // `points` is required in the schema, but a draft can still reach the renderer without it.
  if (!points || points.length === 0) return null

  return (
    <section className="container">
      <SectionHeader label={label} title={title} />

      <dl className={cn('grid gap-8 m-0', columnClassFor(points.length))}>
        {points.map((point, index) => (
          <HighlightCard
            key={point.id}
            figure={point.title}
            label={point.subtitle}
            delay={index * 0.12}
          />
        ))}
      </dl>
    </section>
  )
}
