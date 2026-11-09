'use client'

import React from 'react'
import { MotionConfig, motion, type Variants } from 'motion/react'
import { EASE_OUT_EXPO, DURATION_ENTER, STAGGER_ITEM, VIEWPORT_MARGIN } from '@/utilities/motion'

type Direction = 'up' | 'left' | 'right'

export type StaggerRevealProps = {
  children: React.ReactNode
  className?: string
  /** Stagger delay between each child. Default: 0.08s. */
  stagger?: number
  /** Direction children enter from. Default: 'up'. */
  from?: Direction
  /** Distance in px. Default: 20. */
  distance?: number
  /** HTML tag to render. Default: 'div'. */
  as?: 'div' | 'ul' | 'ol' | 'dl' | 'section'
}

export type StaggerRevealItemProps = {
  children: React.ReactNode
  className?: string
  /** HTML tag to render. Default: 'div'. */
  as?: 'div' | 'li' | 'dd' | 'dt' | 'span' | 'article'
}

function buildVariants(
  from: Direction,
  distance: number,
  stagger: number,
): { container: Variants; item: Variants } {
  const offset = from === 'right' ? -distance : distance
  const transition = { duration: DURATION_ENTER, ease: EASE_OUT_EXPO }

  const hidden =
    from === 'up'
      ? { opacity: 0, y: offset }
      : { opacity: 0, x: offset }

  const visible =
    from === 'up'
      ? { opacity: 1, y: 0, transition }
      : { opacity: 1, x: 0, transition }

  return {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: stagger, delayChildren: 0.1 } },
    },
    item: { hidden, visible },
  }
}

const StaggerContext = React.createContext<Variants | null>(null)

export const StaggerReveal: React.FC<StaggerRevealProps> = ({
  children,
  className,
  stagger = STAGGER_ITEM,
  from = 'up',
  distance = 20,
  as: Tag = 'div',
}) => {
  const { container, item } = buildVariants(from, distance, stagger)
  const MotionTag = motion[Tag] as typeof motion.div

  return (
    <MotionConfig reducedMotion="user">
      <StaggerContext value={item}>
        <MotionTag
          className={className}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: VIEWPORT_MARGIN }}
        >
          {children}
        </MotionTag>
      </StaggerContext>
    </MotionConfig>
  )
}

export const StaggerRevealItem: React.FC<StaggerRevealItemProps> = ({
  children,
  className,
  as: Tag = 'div',
}) => {
  const itemVariants = React.useContext(StaggerContext)
  const MotionTag = motion[Tag] as typeof motion.div

  return (
    <MotionTag className={className} variants={itemVariants ?? undefined}>
      {children}
    </MotionTag>
  )
}
