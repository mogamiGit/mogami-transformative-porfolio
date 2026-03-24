import React from 'react'

interface ListItemProps {
  year: string
  title: string
  subtitle: string
}

export const ListItem: React.FC<ListItemProps> = ({ year, title, subtitle }) => {
  return (
    <div className="group flex items-start gap-4 py-3 border-b border-border/50 hover:border-blue-violet/30 transition-colors">
      <span className="text-sm text-muted-foreground group-hover:text-blue-violet transition-colors whitespace-nowrap">
        [{year}]
      </span>
      <div className="flex-1">
        <p className="font-semibold uppercase text-lg">{title}</p>
        <p className="text-sm text-blue-violet">{subtitle}</p>
      </div>
    </div>
  )
}
