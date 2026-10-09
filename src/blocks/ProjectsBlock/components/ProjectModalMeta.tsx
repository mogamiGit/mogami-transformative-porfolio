import React from 'react'

type ProjectModalMetaProps = {
  client?: string | null
  publishedAt?: string | null
  status?: string | null
}

export const ProjectModalMeta: React.FC<ProjectModalMetaProps> = ({
  client,
  publishedAt,
  status,
}) => {
  if (!client && !publishedAt && !status) return null

  return (
    <div className="font-mono text-sm text-card-foreground opacity-60 flex flex-wrap gap-x-8 gap-y-2">
      {client && (
        <span>
          <span className="text-primary">$</span> client: {client}
        </span>
      )}
      {status && (
        <span>
          <span className="text-primary">$</span> status: {status}
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
