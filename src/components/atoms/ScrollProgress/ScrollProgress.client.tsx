'use client'

import React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

/** Thin bar pinned to the top of the viewport that fills as the page scrolls. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary pointer-events-none"
      style={{ scaleX }}
    />
  )
}
