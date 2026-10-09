import React from 'react'

import { CountUp } from '@/components/atoms/CountUp/CountUp.client'
import { ScrambleText } from '@/components/atoms/ScrambleText/ScrambleText.client'
import { SpotlightCard } from '@/components/atoms/SpotlightCard/SpotlightCard.client'
import { cn } from '@/utilities/ui'

export type HighlightCardProps = {
  /** The headline value. Maps from `points[].title` (e.g. "+5"). */
  figure: string
  /** What the figure counts. Maps from `points[].subtitle`. */
  label: string
  /** Seconds to wait before the entrance, for staggering sibling cards. */
  delay?: number
  className?: string
}

const figureClassName =
  'type-figure text-primary text-xl sm:text-2xl lg:text-3xl m-0 break-words min-w-0'

/**
 * One highlight point as a bordered card.
 *
 * `dt` precedes `dd` in the DOM so the pair is announced in reading order; the
 * figure-first appearance comes from `flex-col-reverse`, which reorders visually
 * without touching the accessibility tree. `Card` hardcodes `flex flex-col`, so
 * that override only wins because `Card` composes through `cn()`.
 *
 * Numeric figures count up; worded ones decode from random glyphs.
 */
export const HighlightCard: React.FC<HighlightCardProps> = ({
  figure,
  label,
  delay,
  className,
}) => {
  const Figure = /\d/.test(figure) ? CountUp : ScrambleText

  return (
    <SpotlightCard
      variant="highlight"
      delay={delay}
      className={cn('flex-col-reverse justify-between gap-6 min-h-44 md:min-h-56 p-6', className)}
    >
      <dt className="text-card-foreground type-label opacity-60">{label}</dt>
      <Figure as="dd" className={figureClassName} value={figure} />
    </SpotlightCard>
  )
}
