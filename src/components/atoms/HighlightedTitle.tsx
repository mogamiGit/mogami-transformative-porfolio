import React from 'react'

interface HighlightedTitleProps {
  title: string
  subtitle: string
}

export const HighlightedTitle: React.FC<HighlightedTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-yellow-chick">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
