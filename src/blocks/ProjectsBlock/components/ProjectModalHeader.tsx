import React from 'react'

type ProjectModalHeaderProps = {
  slug: string
  onClose: () => void
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({ slug, onClose }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card text-xs shrink-0">
      <span className="text-primary">◐</span>
      <div className="text-card-foreground flex-1 opacity-70">
        ~/projects/
        <strong className="text-primary font-medium">{slug}</strong>
        /case-study.md
      </div>
      <button
        onClick={onClose}
        className="w-6 h-6 flex items-center justify-center border border-border text-sm text-card-foreground bg-transparent cursor-pointer font-mono hover:border-primary hover:text-primary transition-colors duration-150"
      >
        −
      </button>
    </div>
  )
}
