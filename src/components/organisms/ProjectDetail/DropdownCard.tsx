'use client'

import React, { useState } from 'react'

interface DropdownCardProps {
  title: string
  description: string
  emoji?: string
  className?: string
}

export const DropdownCard: React.FC<DropdownCardProps> = ({
  title,
  description,
  emoji,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`text-left p-6 rounded-xl border border-border bg-card hover:border-blue-violet/30 transition-all duration-300 ${className || ''}`}
    >
      <div className="flex items-start gap-3">
        {emoji && (
          <span
            className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          >
            {emoji}
          </span>
        )}
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </button>
  )
}
