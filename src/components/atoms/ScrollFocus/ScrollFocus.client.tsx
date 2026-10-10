'use client'

import React, { useRef, useSyncExternalStore } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export type ScrollFocusProps = {
  children: React.ReactNode
  className?: string
  /** Set to false for content that is already on screen at load, so it only reacts when leaving. */
  enter?: boolean
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * Ties its children to the scroll position: they sharpen, brighten and settle into place while
 * entering the viewport, and recede again while leaving through the top.
 */
export const ScrollFocus: React.FC<ScrollFocusProps> = ({ children, className, enter = true }) => {
  const ref = useRef<HTMLDivElement>(null)
  // Reads as `false` on the server and during hydration, so both render the same markup
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )

  // 0 → 1 while the top edge travels from the bottom of the viewport up to 65% of its height
  const { scrollYProgress: entering } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.65'],
  })
  // 0 → 1 while the bottom edge travels from 35% of the viewport height up to its top
  const { scrollYProgress: leaving } = useScroll({
    target: ref,
    offset: ['end 0.35', 'end start'],
  })

  const focus = useTransform<number, number>([entering, leaving], ([a, b]) =>
    Math.min(enter ? a : 1, 1 - b),
  )
  const opacity = useTransform<number, number>(
    [entering, leaving],
    ([a, b]) => (enter ? a : 1) * (1 - 0.65 * b),
  )
  const y = useTransform(entering, (a) => (enter ? 56 * (1 - a) : 0))
  const scale = useTransform(focus, (f) => 0.94 + 0.06 * f)
  // `none` at rest: any other filter value would trap `position: fixed` descendants
  const filter = useTransform(focus, (f) => (f > 0.99 ? 'none' : `blur(${7 * (1 - f)}px)`))

  // The ref stays attached either way: `useScroll` throws when its target never mounts
  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y, scale, filter }}>
      {children}
    </motion.div>
  )
}
