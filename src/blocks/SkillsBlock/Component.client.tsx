'use client'

import React from 'react'
import { MotionConfig, motion, type Variants } from 'motion/react'
import type { Skill } from '@/payload-types'
import { Card } from '@/components/atoms/Card'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { TypedText } from '@/components/atoms/TypedText/TypedText.client'

type Props = {
  label?: string | null
  title?: string | null
  items: Skill[]
}

type CategoryGroup = {
  category: Skill['category']
  skills: Skill[]
}

/** Groups keep the order in which their first skill appears, so `order` in the CMS drives layout. */
const groupByCategory = (skills: Skill[]): CategoryGroup[] => {
  const groups: CategoryGroup[] = []

  for (const skill of skills) {
    const category = skill.category ?? null
    const group = groups.find((g) => g.category === category)
    if (group) group.skills.push(skill)
    else groups.push({ category, skills: [skill] })
  }

  return groups
}

const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const chip: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

const line: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const viewport = { once: true, amount: 0.2 }

const GroupHeader: React.FC<{ path: string; count: number; accent: string }> = ({
  path,
  count,
  accent,
}) => (
  <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-dashed border-card-border">
    <span className="type-command text-card-foreground">
      <span className={accent}>$</span> <TypedText text={`ls ~/skills/${path}`} />
    </span>
    <span className="type-label text-card-foreground opacity-50 tabular-nums">{count} entries</span>
  </div>
)

export const SkillsList: React.FC<Props> = ({ label, title, items }) => {
  if (items.length === 0) return null

  const soft = items.filter((item) => item.skillType === 'soft')
  const hard = items.filter((item) => item.skillType !== 'soft')
  const hardGroups = groupByCategory(hard)

  return (
    <MotionConfig reducedMotion="user">
      <section id="skills" className="container py-16">
        <SectionHeader label={label} title={title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {hard.length > 0 && (
            <Card className="lg:col-span-2 gap-5">
              <GroupHeader path="hard" count={hard.length} accent="text-primary" />

              <div className="flex flex-col gap-5">
                {hardGroups.map((group) => (
                  <div
                    key={group.category ?? 'uncategorized'}
                    className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-2 items-start"
                  >
                    <span className="text-sm text-primary pt-1">
                      {group.category ? `${group.category}/` : './'}
                    </span>
                    <motion.ul
                      className="flex flex-wrap gap-2 m-0 p-0 list-none"
                      variants={list}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewport}
                    >
                      {group.skills.map((skill) => (
                        <motion.li
                          key={skill.id}
                          variants={chip}
                          whileHover={{ y: -3 }}
                          className="inline-flex items-center px-3 py-1 border border-primary/40 bg-primary/8 text-sm text-card-foreground transition-colors duration-150 hover:border-primary hover:bg-primary/20 hover:text-primary cursor-default"
                        >
                          {skill.name}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {soft.length > 0 && (
            <Card variant="highlight" className="gap-5 border-accent-foreground">
              <GroupHeader path="soft" count={soft.length} accent="text-accent-foreground" />

              <motion.ul
                className="flex flex-col gap-4 m-0 p-0 list-none"
                variants={list}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {soft.map((skill) => (
                  <motion.li
                    key={skill.id}
                    variants={line}
                    className="group flex items-baseline gap-3 cursor-default"
                  >
                    <span className="text-accent-foreground text-sm transition-transform duration-150 group-hover:translate-x-1">
                      ▸
                    </span>
                    <span className="type-body-sm text-card-foreground transition-colors duration-150 group-hover:text-accent-foreground">
                      {skill.name}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          )}
        </div>
      </section>
    </MotionConfig>
  )
}
