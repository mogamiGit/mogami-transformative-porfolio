'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Card } from '@/components/atoms/Card'
import { TypedText } from '@/components/atoms/TypedText/TypedText.client'
import { cn } from '@/utilities/ui'

const STEP_MS = 1100

/** Cycles through the mantra steps like a loop running in a terminal. */
export const MantraLoop: React.FC<{ steps: string[] }> = ({ steps }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!inView || reducedMotion || steps.length < 2) return

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length)
    }, STEP_MS)

    return () => window.clearInterval(id)
  }, [inView, reducedMotion, steps.length])

  return (
    <Card ref={ref} variant="highlight" className="gap-5 p-6 md:p-8 border-accent-foreground">
      <div className="pb-3 border-b border-dashed border-card-border type-command text-card-foreground">
        <span className="text-accent-foreground">$</span> <TypedText text="while true; do" />
      </div>

      <ol className="flex flex-col gap-3 m-0 p-0 list-none">
        {steps.map((step, index) => {
          const isActive = !reducedMotion && index === active

          return (
            <motion.li
              key={`${step}-${index}`}
              animate={{ x: isActive ? 10 : 0, opacity: isActive || reducedMotion ? 1 : 0.45 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-baseline gap-3"
            >
              <span className="type-label tabular-nums text-card-foreground opacity-50">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'type-heading transition-colors duration-300',
                  isActive ? 'text-accent-foreground' : 'text-card-foreground',
                )}
              >
                {step}
              </span>
              {isActive && (
                <span aria-hidden="true" className="text-accent-foreground animate-blink">
                  ▍
                </span>
              )}
            </motion.li>
          )
        })}
      </ol>

      <div className="mt-auto pt-3 border-t border-dashed border-card-border type-command text-card-foreground">
        done
      </div>
    </Card>
  )
}
