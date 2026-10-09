import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { Project } from '@/payload-types'
import { cn } from '@/utilities/ui'
import RichText from '@/components/organisms/RichText'
import { RadarChart } from '@/blocks/GitHubStatsBlock/components/RadarChart.client'
import { getProjectRadarData } from '@/utilities/projectRadar'
import { ModalSection } from '@/components/atoms/ModalSection'
import { ProjectModalButtons } from './ProjectModalButtons'
import { ProjectModalMeta } from './ProjectModalMeta'

const SECTIONS = [
  { key: 'problem', title: 'Problem' },
  { key: 'whatIBuilt', title: 'What I Built' },
  { key: 'technicalDecisions', title: 'Technical Decisions' },
  { key: 'constraints', title: 'Constraints' },
  { key: 'outcome', title: 'Outcome' },
] as const

/**
 * Scrollable body of the project modal: an intro with links up front, a sticky
 * index that tracks the section being read, and sections that rise in on scroll.
 * Mounted only while a project is open, so its scroll hooks always have a container.
 */
export const ProjectModalBody: React.FC<{ project: Project }> = ({ project }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const sections = SECTIONS.filter((section) => Boolean(project[section.key]))
  const [active, setActive] = useState<string | null>(sections[0]?.key ?? null)

  // Scores for unknown technologies are random, so compute them once per project.
  const radarData = useMemo(() => getProjectRadarData(project.techStack), [project.techStack])

  // Set while a click-triggered smooth scroll is running, so the index keeps
  // pointing at the section that was asked for instead of flickering past others.
  const locked = useRef(false)
  const unlockTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    let frame = 0

    const update = () => {
      frame = 0
      if (locked.current) return

      const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-modal-section]'))
      if (targets.length === 0) return

      // The "reading line" slides from the top of the modal to its bottom as the
      // scroll advances. A fixed line near the top would never reach the last,
      // short sections, because the container runs out of scroll before they get there.
      const maxScroll = root.scrollHeight - root.clientHeight
      const progress = maxScroll > 0 ? root.scrollTop / maxScroll : 1
      const rootTop = root.getBoundingClientRect().top
      const line = rootTop + root.clientHeight * progress

      let current = targets[0]
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= line) current = target
      }
      setActive(current.id)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [project.id])

  const scrollToSection = (key: string) => {
    setActive(key)
    locked.current = true
    window.clearTimeout(unlockTimer.current)
    unlockTimer.current = window.setTimeout(() => {
      locked.current = false
    }, 900)
    scrollRef.current
      ?.querySelector(`#${CSS.escape(key)}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={scrollRef} className="relative flex-1 overflow-y-auto project-drawer-scroll">
      <header className="flex flex-col gap-6 px-6 md:px-14 pt-12 pb-12 border-b border-dashed border-border/60">
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 type-label tracking-[0.14em] uppercase text-primary">
            {project.tags.map((t) => (
              <span key={t.id}>{t.tag}</span>
            ))}
          </div>
        )}

        <h2 className="type-display text-foreground m-0">{project.title}.</h2>

        {project.overview && (
          <RichText
            data={project.overview}
            enableGutter={false}
            enableProse={false}
            className="max-w-3xl type-lead text-card-foreground opacity-90"
          />
        )}

        <ProjectModalMeta
          client={project.client}
          publishedAt={project.publishedAt}
          status={project.status}
        />
        <ProjectModalButtons githubRepo={project.githubRepo} buttons={project.buttons} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20 px-6 md:px-14 py-14">
        <aside className="flex flex-col gap-12 self-start lg:sticky lg:top-12">
          {sections.length > 1 && (
            <nav className="hidden lg:flex flex-col gap-3" aria-label="Sections">
              {sections.map((section, index) => {
                const isActive = active === section.key

                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => scrollToSection(section.key)}
                    className={cn(
                      'flex items-baseline gap-3 bg-transparent border-none p-0 text-left font-mono text-sm cursor-pointer transition-all duration-200',
                      isActive
                        ? 'text-primary translate-x-2'
                        : 'text-card-foreground opacity-50 hover:opacity-100',
                    )}
                  >
                    <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                    <span>{section.title.toLowerCase()}</span>
                  </button>
                )
              })}
            </nav>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-sm text-card-foreground opacity-50">stack/</span>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center px-2.5 py-1 border border-primary/40 text-sm tracking-[0.06em] uppercase text-primary bg-primary/8"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {radarData && (
            <div className="h-64 w-full">
              <RadarChart data={radarData} />
            </div>
          )}
        </aside>

        <div className="flex flex-col gap-20 min-w-0 max-w-3xl pb-24">
          {sections.map((section, index) => (
            <motion.section
              key={section.key}
              id={section.key}
              data-modal-section
              className="scroll-mt-12"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: scrollRef, once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ModalSection title={section.title} data={project[section.key]} index={index + 1} />
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
