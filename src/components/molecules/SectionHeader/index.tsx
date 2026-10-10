import React from 'react'

import { cn } from '@/utilities/ui'

export type SectionHeaderProps = {
  /** Small annotation before the title, e.g. "type: metrics". */
  label?: string | null
  /** Section name, e.g. "highlights.log". */
  title?: string | null
  /** Right-aligned detail, e.g. an entry count. */
  aside?: React.ReactNode
  className?: string
}

/** Payload optionals are `string | null | undefined`, so `undefined` alone is not enough. */
const isPresent = (value?: string | null): value is string => Boolean(value && value.trim() !== '')

/**
 * The one header every portfolio section shares: accent label, section title
 * and an optional detail on the right. Renders nothing
 * when there is neither a label nor a title, so sections never get an empty rule.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ label, title, aside, className }) => {
  const hasLabel = isPresent(label)
  const hasTitle = isPresent(title)

  if (!hasLabel && !hasTitle) return null

  return (
    <div className={cn('flex items-baseline gap-4 mb-8 pb-3 border-b-2 border-border', className)}>
      {hasLabel && (
        <span className="type-label italic text-accent-foreground opacity-70">{label}</span>
      )}
      {hasTitle && (
        <h2 className="m-0 flex items-center gap-3 type-eyebrow text-primary">
          {/* The one geometric mark: a small diamond announcing each section */}
          <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-primary" />
          {title}
        </h2>
      )}
      {aside && <span className="ml-auto type-label text-card-foreground opacity-50">{aside}</span>}
    </div>
  )
}
