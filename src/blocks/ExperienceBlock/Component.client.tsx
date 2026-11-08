'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MotionConfig, motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import type { Experience } from '@/payload-types'
import { Card } from '@/components/atoms/Card'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { TypedText } from '@/components/atoms/TypedText/TypedText.client'
import { cn } from '@/utilities/ui'

type Props = {
  label?: string
  title?: string
  items: Experience[]
}

type TypeGroup = {
  type: Experience['type']
  items: Experience[]
}

/** Groups keep the order in which their first entry appears, so `order` in the CMS drives layout. */
const groupByType = (items: Experience[]): TypeGroup[] => {
  const groups: TypeGroup[] = []

  for (const item of items) {
    const group = groups.find((g) => g.type === item.type)
    if (group) group.items.push(item)
    else groups.push({ type: item.type, items: [item] })
  }

  return groups
}

/** Education takes the accent colour so the two timelines read as different tracks. */
const ACCENTS: Record<Experience['type'], { text: string; bg: string; border: string }> = {
  work: { text: 'text-primary', bg: 'bg-primary', border: 'border-primary' },
  education: {
    text: 'text-accent-foreground',
    bg: 'bg-accent-foreground',
    border: 'border-accent-foreground',
  },
}

const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}

const entry: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const Timeline: React.FC<{
  group: TypeGroup
  viewportH: number
  onMeasure: (h: number) => void
}> = ({ group, viewportH, onMeasure }) => {
  const accent = ACCENTS[group.type]
  const prefersReduced = useReducedMotion()
  const count = group.items.length

  const isAnimating = !prefersReduced && count > 1

  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, amount: 0.2 })
  const [wrapPhase, setWrapPhase] = useState<'none' | 'exit' | 'enter'>('none')
  const [hovered, setHovered] = useState(false)

  /** Only cycle while hovered; pause during wrap animation. */
  useEffect(() => {
    if (!isAnimating || wrapPhase !== 'none' || !hovered) return
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % count
        if (next === 0 && prev === count - 1) setWrapPhase('exit')
        return next
      })
    }, 2500)
    return () => clearInterval(id)
  }, [isAnimating, count, wrapPhase, hovered])

  /** Reset to first item when hover ends. */
  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (!isAnimating) return
    setActiveIndex(0)
    setWrapPhase('none')
    const el = itemRefs.current[0]
    if (el) setScrollY(-el.offsetTop)
  }, [isAnimating])

  /** Report max item height so parent can unify viewport across timelines. */
  useLayoutEffect(() => {
    if (!isAnimating) return
    let max = 0
    for (const el of itemRefs.current) {
      if (el && el.offsetHeight > max) max = el.offsetHeight
    }
    if (max > 0) onMeasure(max)
  }, [isAnimating, onMeasure])

  /** Align active item to top of viewport. */
  useEffect(() => {
    if (!isAnimating || wrapPhase !== 'none') return
    const el = itemRefs.current[activeIndex]
    if (!el) return
    setScrollY(-el.offsetTop)
  }, [activeIndex, isAnimating, wrapPhase])

  /** Two-phase wrap: exit (fade out in place) → enter (snap + fade in). */
  const handleWrapComplete = () => {
    if (wrapPhase === 'exit') {
      const el = itemRefs.current[0]
      if (el) setScrollY(-el.offsetTop)
      setWrapPhase('enter')
    } else if (wrapPhase === 'enter') {
      setWrapPhase('none')
    }
  }

  return (
    <Card
      className="gap-6 p-6 md:p-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-dashed border-card-border">
        <span className="type-command text-card-foreground">
          <span className={accent.text}>$</span>{' '}
          <TypedText text={`git log ~/experience/${group.type}`} />
        </span>
        <span className="type-label text-card-foreground opacity-50 tabular-nums">
          {group.items.length} entries
        </span>
      </div>

      <div
        ref={containerRef}
        className={cn('relative', isAnimating && 'overflow-hidden')}
        style={
          isAnimating && viewportH > 0
            ? {
                height: viewportH,
                maskImage: 'linear-gradient(to bottom, black 70%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent)',
              }
            : undefined
        }
      >
        <motion.div
          className="relative"
          animate={
            isAnimating
              ? {
                  y: scrollY,
                  opacity: wrapPhase === 'exit' ? 0 : 1,
                  scale: wrapPhase === 'exit' ? 0.97 : 1,
                }
              : undefined
          }
          transition={
            wrapPhase === 'exit'
              ? { duration: 0.3, ease: 'easeIn' }
              : wrapPhase === 'enter'
                ? { duration: 0.45, ease: [0.22, 1, 0.36, 1], y: { duration: 0 } }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }
          onAnimationComplete={handleWrapComplete}
        >
          {/* The rail draws itself downwards as the column scrolls into view. */}
          <motion.div
            aria-hidden="true"
            className={cn('absolute left-[5px] top-2 bottom-2 w-px origin-top opacity-50', accent.bg)}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : undefined}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.ol
            className="flex flex-col gap-8 m-0 p-0 list-none"
            variants={list}
            initial="hidden"
            animate={inView ? 'visible' : undefined}
          >
            {group.items.map((item, index) => (
              <motion.li
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                variants={entry}
                className="group relative pl-8"
              >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute border transition-all duration-500 ease-in-out',
                  accent.border,
                  index === activeIndex
                    ? 'left-0 top-1.5 size-[11px] ' + accent.bg
                    : 'left-[2px] top-2 size-[7px] bg-muted',
                )}
              >
                {index === activeIndex && (
                  <span
                    className={cn(
                      'absolute inset-0 animate-ping motion-reduce:hidden opacity-60',
                      accent.bg,
                    )}
                  />
                )}
              </span>

              <p className="m-0 type-label tabular-nums text-card-foreground opacity-60">
                [{item.period}]
              </p>
              <p className="m-0 mt-1 type-heading text-card-foreground transition-transform duration-200 group-hover:translate-x-1.5">
                {item.organization}
              </p>
              <p className={cn('m-0 mt-1.5 text-sm', accent.text)}>{item.role}</p>
              {item.description && (
                <p className="m-0 mt-2 type-body-sm text-card-foreground opacity-70">
                  {item.description}
                </p>
              )}
            </motion.li>
          ))}
        </motion.ol>
        </motion.div>
      </div>
    </Card>
  )
}

export const ExperienceCardList: React.FC<Props> = ({ label, title, items }) => {
  const maxItemHRef = useRef(0)
  const [viewportH, setViewportH] = useState(0)

  const reportMaxItemH = useCallback((h: number) => {
    if (h > maxItemHRef.current) maxItemHRef.current = h
  }, [])

  useLayoutEffect(() => {
    if (maxItemHRef.current > 0) {
      setViewportH(Math.round(maxItemHRef.current * 1.6 + 32))
    }
  }, [items])

  if (items.length === 0) return null

  const groups = groupByType(items)

  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" className="container py-16">
        <SectionHeader label={label} title={title} />

        <div
          className={cn(
            'grid grid-cols-1 gap-3.5 items-start',
            groups.length > 1 && 'lg:grid-cols-2',
          )}
        >
          {groups.map((group) => (
            <Timeline key={group.type} group={group} viewportH={viewportH} onMeasure={reportMaxItemH} />
          ))}
        </div>
      </section>
    </MotionConfig>
  )
}
