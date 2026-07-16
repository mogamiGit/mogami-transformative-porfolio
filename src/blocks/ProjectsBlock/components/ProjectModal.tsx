import React, { useEffect, useState } from 'react'
import type { Project } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { AnimatePresence, motion } from 'motion/react'
import RichText from '@/components/organisms/RichText'
import { RadarChart } from '@/components/atoms/RadarChart/RadarChart.client'
import { getProjectRadarData } from '@/utilities/projectRadar'
import { ModalSection } from '@/components/atoms/ModalSection'
import { ProjectModalHeader } from './ProjectModalHeader'
import { ProjectModalButtons } from './ProjectModalButtons'
import { ProjectModalMeta } from './ProjectModalMeta'

type Phase = 'pulse' | 'expand' | 'ready'

export const ProjectModal: React.FC<{ project: Project | null; onClose: () => void }> = ({
  project,
  onClose,
}) => {
  const [phase, setPhase] = useState<Phase>('pulse')
  const [prevProjectId, setPrevProjectId] = useState<string | number | null>(null)

  const projectId = project?.id ?? null
  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId)
    if (projectId) setPhase('pulse')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!project) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => setPhase('expand'), 750)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [project])

  const handleExpandComplete = () => {
    if (phase === 'expand') setPhase('ready')
  }

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            onClick={onClose}
            className="fixed inset-0 z-100"
            style={{ background: 'oklch(0 0 0 / 0.55)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.22 }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-101 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className={cn(
                'relative flex flex-col overflow-hidden font-mono pointer-events-auto',
                phase === 'pulse' ? 'border-2 border-primary' : 'border border-primary',
              )}
              style={{
                background: phase === 'pulse' ? 'var(--primary)' : 'var(--background)',
                boxShadow:
                  phase === 'pulse'
                    ? '0 0 40px oklch(0.75 0.18 175 / 0.5), 0 0 80px oklch(0.75 0.18 175 / 0.2)'
                    : '0 0 80px oklch(0 0 0 / 0.5), 0 0 30px oklch(0.75 0.18 175 / 0.15)',
              }}
              initial={{
                width: 16,
                height: 16,
                borderRadius: 0,
                opacity: 1,
              }}
              animate={
                phase === 'pulse'
                  ? {
                      width: 16,
                      height: 16,
                      borderRadius: 0,
                      scale: [1, 1.15, 0.95, 1.08, 1],
                    }
                  : {
                      width: 'calc(100vw - 32px)',
                      height: 'calc(100vh - 32px)',
                      borderRadius: 0,
                      scale: 1,
                    }
              }
              transition={
                phase === 'pulse'
                  ? {
                      scale: {
                        times: [0, 0.25, 0.5, 0.75, 1],
                        duration: 0.7,
                        ease: 'easeInOut',
                      },
                    }
                  : {
                      width: { duration: 0.5, ease: [0.32, 0.72, 0.2, 1] },
                      height: { duration: 0.5, ease: [0.32, 0.72, 0.2, 1] },
                      borderRadius: { duration: 0.3 },
                    }
              }
              exit={{
                width: 16,
                height: 16,
                opacity: 0,
                scale: 0.5,
                transition: {
                  width: { duration: 0.35, ease: [0.4, 0, 0.7, 0.2] },
                  height: { duration: 0.35, ease: [0.4, 0, 0.7, 0.2] },
                  opacity: { duration: 0.25, delay: 0.15 },
                  scale: { duration: 0.3, delay: 0.1 },
                },
              }}
              onAnimationComplete={handleExpandComplete}
            >
              {/* Pulse glow ring — visible during heartbeat only */}
              <AnimatePresence>
                {phase === 'pulse' && (
                  <motion.div
                    className="absolute -inset-1 border-2 border-primary pointer-events-none"
                    style={{ borderRadius: 0 }}
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: [0.6, 0, 0.4, 0], scale: [1, 1.3, 1, 1.2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, times: [0, 0.3, 0.6, 1] }}
                  />
                )}
              </AnimatePresence>

              {/* Content — fades in after expand */}
              <motion.div
                className="flex flex-col h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'ready' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectModalHeader
                  slug={project.slug ?? project.title?.toLowerCase().replace(/\s+/g, '-')}
                  onClose={onClose}
                />

                {/* Modal body */}
                <div className="flex flex-col flex-1 overflow-y-auto px-8 py-6 project-drawer-scroll gap-3.5">
                  {project.tags?.[0] && (
                    <div className="text-[10px] text-primary tracking-[0.14em] uppercase">
                      {project.tags[0].tag.toUpperCase()}
                    </div>
                  )}

                  <h2
                    className="font-kalnia text-foreground leading-none tracking-tight font-normal"
                    style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
                  >
                    {project.title}.
                  </h2>

                  {/* Overview */}
                  {project.overview && (
                    <RichText
                      data={project.overview}
                      enableGutter={false}
                      enableProse={false}
                      className="text-sm text-card-foreground opacity-70 leading-relaxed"
                    />
                  )}

                  <div className="flex gap-12">
                    <div className="flex flex-col gap-4">
                      {/* Tech stack */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-medium text-foreground">Stack</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.map((t) => (
                              <span
                                key={t.id}
                                className="inline-flex items-center px-2 py-0.5 border border-primary/40 text-[11px] tracking-[0.06em] uppercase text-primary bg-primary/8"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Project Radar */}
                      {(() => {
                        const radarData = getProjectRadarData(project.techStack)
                        if (!radarData) return null
                        return <RadarChart data={radarData} size={260} />
                      })()}
                    </div>

                    <div className="flex-1 flex flex-col gap-6.5">
                      <ModalSection title="Problem" data={project.problem} />
                      <ModalSection title="What I Built" data={project.whatIBuilt} />
                      <ModalSection title="Technical Decisions" data={project.technicalDecisions} />
                      <ModalSection title="Constraints" data={project.constraints} />
                      <ModalSection title="Outcome" data={project.outcome} />
                    </div>
                  </div>

                  <ProjectModalButtons
                    githubRepo={project.githubRepo}
                    buttons={project.buttons}
                  />

                  <ProjectModalMeta
                    client={project.client}
                    publishedAt={project.publishedAt}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
