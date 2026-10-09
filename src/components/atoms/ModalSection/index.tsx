import React from 'react'

import type { Project } from '@/payload-types'
import RichText from '@/components/organisms/RichText'

type ModalSectionProps = {
  title: string
  data: Project['overview']
  /** 1-based position, shown as a "01" style counter before the title. */
  index?: number
}

export const ModalSection: React.FC<ModalSectionProps> = ({ title, data, index }) => {
  if (!data) return null

  return (
    <div className="flex flex-col gap-6">
      <h3 className="flex items-baseline gap-3 m-0 pb-4 border-b border-dashed border-border/50 type-title text-foreground">
        {index !== undefined && (
          <span className="font-mono text-xl md:text-2xl tabular-nums text-accent-foreground">
            {String(index).padStart(2, '0')}
          </span>
        )}
        {title}
      </h3>
      <RichText
        data={data}
        enableGutter={false}
        enableProse={false}
        className="type-body text-card-foreground opacity-80 [&_p]:mb-5 [&_p:last-child]:mb-0"
      />
    </div>
  )
}
