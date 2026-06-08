'use client'
import React from 'react'
import { cn } from '@/utilities/ui'
import { type LucideIcon } from 'lucide-react'

const variants = {
  base: 'bg-primary text-primary-foreground px-4 py-3 font-semibold',
  line: 'border border-primary text-blue-500 hover:bg-blue-100 px-4 py-3',
  link: 'text-primary underline',
}

export const MainButton: React.FC<{
  type: 'base' | 'line' | 'link'
  label: string
  icon?: LucideIcon
  className?: string
  onClick?: () => void
}> = (props) => {
  const { type = 'base', label, icon: Icon, className, onClick } = props

  return (
    <button className={cn(variants[type], className)} onClick={onClick}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label.replace(/ /g, '_')}
      </div>
    </button>
  )
}
