'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

export type ToggleOption<T extends string> = {
  value: T
  label: React.ReactNode
}

type Props<T extends string> = {
  options: ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Toggle<T extends string>({ options, value, onChange, className }: Props<T>) {
  return (
    <div className={cn('flex border border-interactive', className)}>
      {options.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-2.5 py-1 text-sm font-mono cursor-pointer border-none',
            i < options.length - 1 && 'border-r border-interactive',
            value === opt.value
              ? 'bg-interactive text-primary-foreground'
              : 'bg-transparent text-interactive',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
