import React from 'react'

type ProjectModalMetaProps = {
  client?: string | null
  publishedAt?: string | null
}

export const ProjectModalMeta: React.FC<ProjectModalMetaProps> = ({ client, publishedAt }) => {
  if (!client && !publishedAt) return null

  return (
    <div className="mt-6 pt-4 border-t border-dashed border-border text-xs text-card-foreground opacity-50 flex flex-wrap gap-x-4 gap-y-1">
      {client && (
        <span>
          <span className="text-primary">$</span> client: {client}
        </span>
      )}
      {publishedAt && (
        <span>
          <span className="text-primary">$</span> date:{' '}
          {new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          })}
        </span>
      )}
    </div>
  )
}
