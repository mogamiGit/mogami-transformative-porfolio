import React from 'react'
import type { Project } from '@/payload-types'

type ProjectModalButtonsProps = {
  githubRepo?: string | null
  buttons?: Project['buttons']
}

export const ProjectModalButtons: React.FC<ProjectModalButtonsProps> = ({
  githubRepo,
  buttons,
}) => {
  if ((!buttons || buttons.length === 0) && !githubRepo) return null

  return (
    <div className="flex gap-3 flex-wrap pt-2">
      {githubRepo && (
        <a
          href={`https://github.com/${githubRepo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-interactive text-sm text-interactive bg-interactive/8 no-underline font-mono cursor-pointer hover:bg-interactive/20 transition-colors duration-150"
        >
          <span className="text-card-foreground opacity-50">$ </span>
          GitHub ↗
        </a>
      )}
      {buttons?.map((btn) => (
        <a
          key={btn.id}
          href={btn.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-interactive text-sm text-interactive bg-interactive/8 no-underline font-mono cursor-pointer hover:bg-interactive/20 transition-colors duration-150"
        >
          <span className="text-card-foreground opacity-50">$ </span>
          {btn.text}
          {btn.icon === 'external' && ' ↗'}
          {btn.icon === 'pencil' && ' ⎇'}
        </a>
      ))}
    </div>
  )
}
