'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/atoms/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

/* Scroll distance in px after which the full-width bar condenses into the floating pill */
const CONDENSE_AFTER = 48

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [condensed, setCondensed] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (latest) => setCondensed(latest > CONDENSE_AFTER))

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-primary"
        style={{ scaleX: progress }}
      />
      <header
        className="container sticky top-4 z-20 flex justify-center pointer-events-none"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div
          className={cn(
            'pointer-events-auto flex w-full items-center justify-between gap-4 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            condensed
              ? 'max-w-3xl border-border/30 bg-background/60 py-2.5 pl-7 pr-3 shadow-[0_8px_32px_oklch(0_0_0/0.35)] backdrop-blur-xl'
              : 'max-w-full border-transparent bg-transparent px-0 py-5',
          )}
        >
          <Link href="/" className="shrink-0">
            <Logo
              loading="eager"
              priority="high"
              className={cn(
                'invert transition-[height] duration-500 dark:invert-0',
                condensed && 'h-6!',
              )}
            />
          </Link>
          <HeaderNav data={data} />
        </div>
      </header>
    </MotionConfig>
  )
}
