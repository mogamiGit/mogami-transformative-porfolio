'use client'

import React, { useState, useCallback } from 'react'
import type { Project } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { FolderIcon } from './components/FolderIcon'
import { ProjectDrawer } from './components/ProjectDrawer'
import { ViewToggle } from '@/components/organisms/ViewToggle'

type Props = {
  projects: Project[]
}

export const ProjectsGrid: React.FC<Props> = ({ projects }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [hovered, setHovered] = useState<number | null>(null)
  const [openProject, setOpenProject] = useState<Project | null>(null)

  const handleClose = useCallback(() => setOpenProject(null), [])

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
        <div className="max-w-150">
          <h2
            className="font-kalnia text-foreground leading-none tracking-tight font-normal"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
          >
            Selected{' '}
            <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>work</em>.
          </h2>
          <p className="mt-3 text-[13px] text-card-foreground opacity-60">
            {projects.length} directories. Click any folder to open the case file.
          </p>
        </div>

        <ViewToggle view={view} onViewChange={setView} command="$ ls ~/mogami/projects" />
      </div>

      {/* Grid / List view */}
      <div key={view} className="animate-in fade-in duration-200">

      {/* Grid view */}
      {view === 'grid' && (
        <div
          className="grid grid-cols-4 gap-x-2 gap-y-3 px-3 py-4 border border-border"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 23px,
              oklch(from var(--primary) l c h / 0.025) 23px,
              oklch(from var(--primary) l c h / 0.025) 24px
            ), var(--card)`,
          }}
        >
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenProject(p)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center gap-2 px-1 py-1.5 bg-transparent border-none cursor-pointer text-center w-full font-mono"
            >
              <FolderIcon hovered={hovered === p.id} />

              <div
                className={cn(
                  'text-[12.5px] font-medium transition-colors duration-150',
                  hovered === p.id ? 'text-primary' : 'text-foreground',
                )}
              >
                {p.slug ?? p.title.toLowerCase().replace(/\s+/g, '-')}/
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-card-foreground opacity-50 tracking-[0.06em]">
                {p.tags?.[0] && <span>{p.tags[0].tag.toLowerCase()}</span>}
              </div>

              <div
                className={cn(
                  'text-[9.5px] text-primary tracking-[0.04em] transition-all duration-160 ease-in-out',
                  hovered === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0.5',
                )}
              >
                {'$ open ./'}{p.slug ?? p.title.toLowerCase().replace(/\s+/g, '-')}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="border border-border font-mono">
          <div
            className="grid gap-3 px-4 py-2 border-b border-border text-[10px] text-card-foreground opacity-50 tracking-widest uppercase"
            style={{
              gridTemplateColumns: '110px 1fr 140px 80px 80px 24px',
              background: 'oklch(0.14 0.04 195)',
            }}
          >
            <span>permission</span>
            <span>name</span>
            <span>type</span>
            <span>year</span>
            <span>size</span>
            <span />
          </div>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenProject(p)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'grid gap-3 px-4 py-2.5 border-b border-border items-center cursor-pointer text-left w-full font-mono transition-colors duration-120 ease-in-out',
                hovered === p.id ? 'bg-primary/6' : 'bg-transparent',
              )}
              style={{ gridTemplateColumns: '110px 1fr 140px 80px 80px 24px' }}
            >
              <span className="text-[11px] text-card-foreground opacity-40">drwxr-xr-x</span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-primary text-[11px]">▸</span>
                <span
                  className={cn(
                    'text-[13px] transition-colors duration-120 ease-in-out',
                    hovered === p.id ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {p.slug ?? p.title.toLowerCase().replace(/\s+/g, '-')}/
                </span>
                <span className="ml-2 text-xs text-card-foreground opacity-50">
                  {p.title}
                </span>
              </span>
              <span className="text-xs text-card-foreground opacity-50">
                {p.tags?.[0]?.tag.toLowerCase() ?? '—'}
              </span>
              <span className="text-[11px] text-card-foreground opacity-40">
                {p.techStack?.length ?? 0}K
              </span>
              <span
                className={cn(
                  'transition-all duration-120 ease-in-out',
                  hovered === p.id
                    ? 'text-primary translate-x-0.75 opacity-100'
                    : 'text-card-foreground translate-x-0 opacity-40',
                )}
              >
                →
              </span>
            </button>
          ))}
        </div>
      )}

      </div>{/* end animate wrapper */}

      <ProjectDrawer project={openProject} onClose={handleClose} />
    </>
  )
}
