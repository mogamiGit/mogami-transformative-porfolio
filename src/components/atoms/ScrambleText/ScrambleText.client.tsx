'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&<>_'
const FRAME_MS = 40

const scramble = (value: string, resolved: number) =>
  value
    .split('')
    .map((char, index) => {
      // Spaces and punctuation stay put so the word shape is readable throughout.
      if (index < resolved || !/[a-z0-9]/i.test(char)) return char
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    })
    .join('')

export type ScrambleTextProps = {
  value: string
  /** Element to render, so the text stays a direct text child of its semantic tag. */
  as?: 'span' | 'dd'
  className?: string
  /** Total decode time in milliseconds. */
  duration?: number
}

/**
 * Decodes `value` from random glyphs, left to right, the first time it scrolls
 * into view. Renders the plain value before and after, as a single text node.
 */
export const ScrambleText: React.FC<ScrambleTextProps> = ({
  value,
  as: Tag = 'span',
  className,
  duration = 900,
}) => {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotion()
  const [scrambled, setScrambled] = useState<string | null>(null)

  useEffect(() => {
    if (!inView || reducedMotion) return

    const frames = Math.max(1, Math.round(duration / FRAME_MS))
    let frame = 0

    const id = window.setInterval(() => {
      frame += 1
      if (frame >= frames) {
        window.clearInterval(id)
        setScrambled(null)
        return
      }
      setScrambled(scramble(value, Math.floor((frame / frames) * value.length)))
    }, FRAME_MS)

    return () => window.clearInterval(id)
  }, [duration, inView, reducedMotion, value])

  return (
    <Tag ref={ref} className={className}>
      {scrambled ?? value}
    </Tag>
  )
}
