'use client'

import React from 'react'
import { MotionConfig, motion } from 'motion/react'
import { Card, type CardProps } from '@/components/atoms/Card'
import { cn } from '@/utilities/ui'

const MotionCard = motion.create(Card)

export type SpotlightCardProps = Pick<CardProps, 'variant' | 'className' | 'children'> & {
  /** Seconds to wait before the entrance, for staggering sibling cards. */
  delay?: number
}

/**
 * A `Card` that rises into view, lifts on hover and lights up under the cursor.
 *
 * The glow and the accent line are pseudo-elements rather than extra nodes, so
 * the card can still be used where only specific children are valid (e.g. `dl`).
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  variant,
  className,
  children,
  delay = 0,
}) => {
  const trackPointer = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const bounds = card.getBoundingClientRect()
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <MotionConfig reducedMotion="user">
      <MotionCard
        variant={variant}
        onMouseMove={trackPointer}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
        className={cn(
          'relative overflow-hidden',
          "before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
          'before:bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgb(0_212_170/0.22),transparent_70%)]',
          "after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent-foreground after:origin-left after:scale-x-0 after:transition-transform after:duration-500 hover:after:scale-x-100",
          className,
        )}
      >
        {children}
      </MotionCard>
    </MotionConfig>
  )
}
