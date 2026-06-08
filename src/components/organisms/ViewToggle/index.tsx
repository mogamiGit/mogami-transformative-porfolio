'use client'

import React from 'react'
import { Toggle } from '@/components/atoms/Toggle'

type View = 'grid' | 'list'

const VIEW_OPTIONS = [
  { value: 'grid' as const, label: '▦ icons' },
  { value: 'list' as const, label: '≡ list' },
]

type Props = {
  view: View
  onViewChange: (v: View) => void
  command?: string
}

export const ViewToggle: React.FC<Props> = ({ view, onViewChange, command }) => (
  <div className="flex items-center gap-3 text-[11px] font-mono">
    {command && <span className="text-primary">{command}</span>}
    <Toggle options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
  </div>
)
