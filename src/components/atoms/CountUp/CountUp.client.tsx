'use client'

import React, { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

const NUMERIC = /^(\D*)(\d+)(.*)$/

const format = (prefix: string, amount: number, suffix: string) =>
  `${prefix}${Math.round(amount).toLocaleString('en-US')}${suffix}`

export type CountUpProps = {
  value: string
  /** Element to render, so the figure stays a direct text child of its semantic tag. */
  as?: 'span' | 'dd'
  className?: string
}

/**
 * Counts up to the first number in `value` when it scrolls into view, keeping
 * any prefix and suffix ("8+", "+20"). Values without a number render as-is.
 *
 * The figure is always a single text node of the rendered element, which keeps
 * it addressable by its text for assistive tech and for tests.
 */
export const CountUp: React.FC<CountUpProps> = ({ value, as: Tag = 'span', className }) => {
  const match = NUMERIC.exec(value)
  const hasNumber = match !== null
  const prefix = match?.[1] ?? ''
  const target = match ? Number(match[2]) : 0
  const suffix = match?.[3] ?? ''

  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotion()
  const [animated, setAnimated] = useState<string | null>(null)

  useEffect(() => {
    if (!hasNumber || !inView || reducedMotion) return

    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (latest) => setAnimated(format(prefix, latest, suffix)),
      onComplete: () => setAnimated(null),
    })
    return () => controls.stop()
  }, [hasNumber, inView, prefix, reducedMotion, suffix, target])

  return (
    <Tag ref={ref} className={className}>
      {animated ?? value}
    </Tag>
  )
}
