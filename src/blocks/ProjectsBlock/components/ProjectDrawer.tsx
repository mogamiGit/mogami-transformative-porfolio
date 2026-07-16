import React, { useEffect, useState } from 'react'
import type { Project } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { AnimatePresence, motion } from 'motion/react'
import RichText from '@/components/organisms/RichText'

type Phase = 'pulse' | 'expand' | 'ready'

export const ProjectDrawer: React.FC<{ project: Project | null; onClose: () => void }> = ({
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
                {/* Modal header */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card text-xs shrink-0">
                  <span className="text-primary">◐</span>
                  <div className="text-card-foreground flex-1 opacity-70">
                    ~/projects/
                    <strong className="text-primary font-medium">
                      {project.slug ?? project.title?.toLowerCase().replace(/\s+/g, '-')}
                    </strong>
                    /case-study.md
                  </div>
                  <button
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center border border-border text-sm text-card-foreground bg-transparent cursor-pointer font-mono hover:border-primary hover:text-primary transition-colors duration-150"
                  >
                    −
                  </button>
                </div>

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
                    <RichText data={project.overview} enableGutter={false} enableProse={false} className="text-sm text-card-foreground opacity-70 leading-relaxed" />
                  )}

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

                  {/* Problem */}
                  {project.problem && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium text-foreground">Problem</h3>
                      <RichText data={project.problem} enableGutter={false} enableProse={false} className="text-sm text-card-foreground opacity-70 leading-relaxed" />
                    </div>
                  )}

                  {/* What I Built */}
                  {project.whatIBuilt && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium text-foreground">What I Built</h3>
                      <RichText data={project.whatIBuilt} enableGutter={false} enableProse={false} className="text-sm text-card-foreground opacity-70 leading-relaxed" />
                    </div>
                  )}

                  {/* Technical Decisions */}
                  {project.technicalDecisions && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium text-foreground">Technical Decisions</h3>
                      <RichText data={project.technicalDecisions} enableGutter={false} enableProse={false} className="text-sm text-card-foreground opacity-70 leading-relaxed" />
                    </div>
                  )}

                  {/* Constraints */}
                  {project.constraints && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium text-foreground">Constraints</h3>
                      <RichText data={project.constraints} enableGutter={false} enableProse={false} className="text-sm text-card-foreground opacity-70 leading-relaxed" />
                    </div>
                  )}

                  {/* Outcome */}
                  {project.outcome && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium text-foreground">Outcome</h3>
                      <RichText data={project.outcome} enableGutter={false} enableProse={false} className="text-sm text-card-foreground opacity-70 leading-relaxed" />
                    </div>
                  )}

                  {/* Buttons */}
                  {project.buttons && project.buttons.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-dashed border-border flex gap-2 flex-wrap">
                      {project.buttons.map((btn) => (
                        <a
                          key={btn.id}
                          href={btn.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-primary text-xs text-primary bg-primary/8 no-underline font-mono cursor-pointer"
                        >
                          <span className="text-card-foreground opacity-50">$ </span>
                          {btn.text}
                          {btn.icon === 'external' && ' ↗'}
                          {btn.icon === 'pencil' && ' ⎇'}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  {(project.client || project.publishedAt) && (
                    <div className="mt-6 pt-4 border-t border-dashed border-border text-xs text-card-foreground opacity-50 flex flex-wrap gap-x-4 gap-y-1">
                      {project.client && (
                        <span><span className="text-primary">$</span> client: {project.client}</span>
                      )}
                      {project.publishedAt && (
                        <span><span className="text-primary">$</span> date: {new Date(project.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
