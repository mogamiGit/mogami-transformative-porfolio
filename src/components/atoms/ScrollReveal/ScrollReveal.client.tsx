'use client'

import React, { useRef, useSyncExternalStore } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

type Direction = 'up' | 'left' | 'right'

export type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  /** Direction content enters from. Default: 'up'. */
  from?: Direction
  /** Pixels to travel. Default: 24. */
  distance?: number
  /** If true, element fades out when leaving through the top. Default: false. */
  exit?: boolean
  /** HTML tag to render. Default: 'div'. */
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * Progressively reveals its children as the user scrolls, tying opacity and
 * translation to actual scroll progress rather than a binary in-view flip.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  from = 'up',
  distance = 24,
  exit = false,
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )

  // 0 → 1 while the element's top edge travels from the viewport bottom to 75% of its height
  const { scrollYProgress: entering } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.75'],
  })

  // 0 → 1 while the element's bottom edge travels from 30% of the viewport to its top
  const { scrollYProgress: leaving } = useScroll({
    target: ref,
    offset: ['end 0.3', 'end start'],
  })

  const opacity = useTransform<number, number>(
    [entering, leaving],
    ([enterP, leaveP]) => enterP * (exit ? 1 - 0.6 * leaveP : 1),
  )

  // Always compute both directions — only one is used, but hooks must be unconditional
  const positiveTranslation = useTransform(entering, (p) => distance * (1 - p))
  const negativeTranslation = useTransform(entering, (p) => -distance * (1 - p))

  const MotionTag = motion[Tag] as typeof motion.div

  if (reduceMotion) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
        {children}
      </div>
    )
  }

  const style =
    from === 'up'
      ? { opacity, y: positiveTranslation }
      : from === 'left'
        ? { opacity, x: positiveTranslation }
        : { opacity, x: negativeTranslation }

  return (
    <MotionTag ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {children}
    </MotionTag>
  )
}
