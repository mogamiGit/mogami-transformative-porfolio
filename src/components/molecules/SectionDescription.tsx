import React from 'react'
import { Tag } from '@/components/atoms/Tag'

interface SectionDescriptionProps {
  title: string
  description?: string
  tags?: string[]
  link?: string
  className?: string
}

export const SectionDescription: React.FC<SectionDescriptionProps> = ({
  title,
  description,
  tags,
  link,
  className,
}) => {
  return (
    <div className={className}>
      <p className="font-kalnia text-sm text-muted-foreground capitalize">{title}</p>
      {description && (
        <div className="mt-1">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 hover:text-blue-violet transition-colors"
            >
              <span>{description}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
          ) : (
            <p>{description}</p>
          )}
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, i) => (
            <Tag key={i} text={tag} variant="gray" />
          ))}
        </div>
      )}
    </div>
  )
}
