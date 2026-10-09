'use client'

import React from 'react'
import { MotionConfig, motion } from 'motion/react'

export type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Seconds to wait before animating, for staggering siblings. */
  delay?: number
}

/** Fades and lifts its children into place the first time they scroll into view. */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0 }) => {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
