'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

export type TypedTextProps = {
  text: string
  /** Milliseconds per character. */
  speed?: number
  className?: string
}

/**
 * Types `text` out like a terminal command the first time it scrolls into view.
 *
 * The untyped remainder stays in the flow as invisible text so the line never
 * reflows while typing, and the full string is exposed once to assistive tech.
 */
export const TypedText: React.FC<TypedTextProps> = ({ text, speed = 45, className }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reducedMotion = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || reducedMotion) return

    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(id)
          return current
        }
        return current + 1
      })
    }, speed)

    return () => window.clearInterval(id)
  }, [inView, reducedMotion, speed, text])

  const shown = reducedMotion ? text.length : Math.min(count, text.length)
  const typing = shown < text.length

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        <span className="relative">
          {typing && <span className="absolute left-0 text-primary animate-blink">▍</span>}
        </span>
        <span className="invisible">{text.slice(shown)}</span>
      </span>
    </span>
  )
}
