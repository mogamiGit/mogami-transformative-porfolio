import React from 'react'
import { cn } from '@/utilities/ui'

interface TagProps {
  text: string
  variant?: 'yellow' | 'blue' | 'gray'
  icon?: React.ReactNode
  className?: string
}

const variantClasses = {
  yellow: 'bg-yellow-chick/20 text-yellow-chick border-yellow-chick/30',
  blue: 'bg-blue-violet/20 text-blue-violet border-blue-violet/30',
  gray: 'bg-muted text-muted-foreground border-border',
}

export const Tag: React.FC<TagProps> = ({ text, variant = 'gray', icon, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full border',
        variantClasses[variant],
        className,
      )}
    >
      {icon}
      {text}
    </span>
  )
}
