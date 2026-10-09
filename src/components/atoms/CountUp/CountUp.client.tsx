'use client'

import React, { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'

const NUMERIC = /^(\D*)(\d+)(.*)$/

/**
 * Counts up to the first number in `value` when it scrolls into view, keeping
 * any prefix and suffix ("8+", "+20"). Values without a number render as-is.
 */
export const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const match = NUMERIC.exec(value)
  const hasNumber = match !== null
  const target = match ? Number(match[2]) : 0

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotion()
  const current = useMotionValue(target)
  const rounded = useTransform(current, (latest) => Math.round(latest))

  useEffect(() => {
    if (!hasNumber || !inView || reducedMotion) return

    const controls = animate(current, [0, target], { duration: 1.4, ease: 'easeOut' })
    return () => controls.stop()
  }, [current, hasNumber, inView, reducedMotion, target])

  if (!match) return <>{value}</>

  return (
    <span ref={ref} className="tabular-nums">
      {match[1]}
      <motion.span>{rounded}</motion.span>
      {match[3]}
    </span>
  )
}
