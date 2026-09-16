import React from 'react'

import type { HighlightPointsBlockType } from '@/payload-types'
import { HighlightCard } from '@/components/molecules/HighlightCard'
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

/** Payload optionals are `string | null | undefined`, so `undefined` alone is not enough. */
const isPresent = (value?: string | null): value is string => Boolean(value && value.trim() !== '')

export const HighlightPointsBlockComponent: React.FC<HighlightPointsBlockType> = ({
  label,
  title,
  points,
}) => {
  // `points` is required in the schema, but a draft can still reach the renderer without it.
  if (!points || points.length === 0) return null

  const hasLabel = isPresent(label)
  const hasTitle = isPresent(title)

  return (
    <section className="container">
      {(hasLabel || hasTitle) && (
        <div className="flex items-baseline gap-4 mb-8 pb-3 border-b border-dashed border-border">
          {hasLabel && <span className="text-[11px] text-card-foreground opacity-50">{label}</span>}
          {hasTitle && (
            <span className="text-[11px] tracking-widest uppercase font-mono text-primary">
              {title}
            </span>
          )}
        </div>
      )}

      <dl className={cn('grid gap-8 m-0', columnClassFor(points.length))}>
        {points.map((point) => (
          <HighlightCard key={point.id} figure={point.title} label={point.subtitle} />
        ))}
      </dl>
    </section>
  )
}
