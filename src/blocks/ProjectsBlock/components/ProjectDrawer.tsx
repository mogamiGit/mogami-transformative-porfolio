import React, { useEffect } from 'react'
import type { Project } from '@/payload-types'
import { cn } from '@/utilities/ui'

export const ProjectDrawer: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const open = !!project

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-100 transition-opacity duration-220 ease-in-out',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{ background: 'oklch(0 0 0 / 0.55)', backdropFilter: 'blur(6px)' }}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 flex flex-col overflow-hidden z-101 font-mono bg-background border-l border-primary',
          'transition-transform duration-280',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{
          width: 'min(720px, 96vw)',
          boxShadow: '-20px 0 60px oklch(0 0 0 / 0.4)',
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0.2, 1)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card text-xs shrink-0">
          <span className="text-primary">◐</span>
          <div className="text-card-foreground flex-1 opacity-70">
            ~/projects/
            <strong className="text-primary font-medium">
              {project?.slug ?? project?.title?.toLowerCase().replace(/\s+/g, '-')}
            </strong>
            /case-study.md
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-0.5 border border-border text-[11px] text-card-foreground bg-transparent cursor-pointer font-mono"
          >
            esc · close
          </button>
        </div>

        {/* Drawer body */}
        {project && (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {project.tags?.[0] && (
              <div className="text-[10px] text-primary tracking-[0.14em] uppercase mb-3">
                {project.tags[0].tag.toUpperCase()}
              </div>
            )}

            <h2
              className="font-kalnia text-foreground leading-none tracking-tight font-normal mb-2"
              style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
            >
              {project.title}.
            </h2>

            {/* Cover placeholder */}
            <div
              className="w-full border border-border mb-6 overflow-hidden flex items-center justify-center"
              style={{ aspectRatio: '16/9', background: 'oklch(0.14 0.04 195)' }}
            >
              <svg viewBox="0 0 400 250" className="w-full h-full block">
                <defs>
                  <radialGradient id={`glow-${project.id}`} cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="400" height="250" fill="oklch(0.14 0.04 195)" />
                <ellipse cx="200" cy="125" rx="180" ry="100" fill={`url(#glow-${project.id})`} />
                <text
                  x="200"
                  y="135"
                  fontFamily="ui-monospace, monospace"
                  fontSize="13"
                  fill="var(--primary)"
                  opacity="0.5"
                  textAnchor="middle"
                >
                  ./{project.slug ?? project.title}.preview
                </text>
              </svg>
            </div>

            {/* Tech stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="mb-6">
                <div className="text-[11px] text-primary tracking-[0.12em] uppercase mb-3">
                  <span className="text-card-foreground opacity-40">## </span>stack
                </div>
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

            {/* Buttons */}
            {project.buttons && project.buttons.length > 0 && (
              <div className="mt-6 pt-4 border-t border-dashed border-border flex gap-2 flex-wrap">
                {project.buttons.map((btn) => (
                  <a
                    key={btn.id}
                    href={btn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-[14px] py-1.5 border border-primary text-xs text-primary bg-primary/8 no-underline font-mono cursor-pointer"
                  >
                    <span className="text-card-foreground opacity-50">$ </span>
                    {btn.text}
                    {btn.icon === 'external' && ' ↗'}
                    {btn.icon === 'pencil' && ' ⎇'}
                  </a>
                ))}
              </div>
            )}

            {/* Client */}
            {project.client && (
              <div className="mt-6 pt-4 border-t border-dashed border-border text-xs text-card-foreground opacity-50">
                <span className="text-primary">$</span> client: {project.client} · press{' '}
                <kbd className="font-mono text-[10px] px-1.25 py-px border border-border bg-card">
                  esc
                </kbd>{' '}
                to close
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
