'use client'

import React from 'react'
import { MotionConfig, motion, type Variants } from 'motion/react'
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

const viewport = { once: true, amount: 0.2 }

const Timeline: React.FC<{ group: TypeGroup }> = ({ group }) => {
  const accent = ACCENTS[group.type]

  return (
    <Card className="gap-6 p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-dashed border-card-border">
        <span className="type-command text-card-foreground">
          <span className={accent.text}>$</span>{' '}
          <TypedText text={`git log ~/experience/${group.type}`} />
        </span>
        <span className="type-label text-card-foreground opacity-50 tabular-nums">
          {group.items.length} entries
        </span>
      </div>

      <div className="relative">
        {/* The rail draws itself downwards as the column scrolls into view. */}
        <motion.div
          aria-hidden="true"
          className={cn('absolute left-[5px] top-2 bottom-2 w-px origin-top opacity-50', accent.bg)}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={viewport}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.ol
          className="flex flex-col gap-8 m-0 p-0 list-none"
          variants={list}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {group.items.map((item, index) => (
            <motion.li key={item.id} variants={entry} className="group relative pl-8">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 top-1.5 size-[11px] border bg-card transition-colors duration-200',
                  accent.border,
                  index === 0 && accent.bg,
                )}
              >
                {index === 0 && (
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
      </div>
    </Card>
  )
}

export const ExperienceCardList: React.FC<Props> = ({ label, title, items }) => {
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
            <Timeline key={group.type} group={group} />
          ))}
        </div>
      </section>
    </MotionConfig>
  )
}
