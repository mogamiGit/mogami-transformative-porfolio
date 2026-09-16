import React from 'react'

import { Card } from '@/components/atoms/Card'
import { cn } from '@/utilities/ui'

export type HighlightCardProps = {
  /** The headline value. Maps from `points[].title` (e.g. "+5"). */
  figure: string
  /** What the figure counts. Maps from `points[].subtitle`. */
  label: string
  className?: string
}

/**
 * One highlight point as a bordered card.
 *
 * `dt` precedes `dd` in the DOM so the pair is announced in reading order; the
 * figure-first appearance comes from `flex-col-reverse`, which reorders visually
 * without touching the accessibility tree. `Card` hardcodes `flex flex-col`, so
 * that override only wins because `Card` composes through `cn()`.
 */
export const HighlightCard: React.FC<HighlightCardProps> = ({ figure, label, className }) => {
  return (
    <Card variant="highlight" className={cn('flex-col-reverse gap-1.5', className)}>
      <dt className="text-card-foreground text-[10px] opacity-60">{label}</dt>
      <dd className="text-primary text-3xl font-bold m-0">{figure}</dd>
    </Card>
  )
}
