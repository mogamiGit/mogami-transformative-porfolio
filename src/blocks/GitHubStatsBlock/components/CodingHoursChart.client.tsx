'use client'

import React from 'react'
import type { CodingHourCell } from '@/utilities/github'

type Props = {
  data: CodingHourCell[]
  cellSize?: number
  cellGap?: number
}

const LEVEL_COLORS = [
  'var(--heatmap-0, #161b22)',
  'var(--heatmap-1, #0e4429)',
  'var(--heatmap-2, #006d32)',
  'var(--heatmap-3, #26a641)',
  'var(--heatmap-4, #39d353)',
] as const

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export const CodingHoursChart: React.FC<Props> = ({ data, cellSize = 14, cellGap = 2 }) => {
  if (data.length === 0) return null

  const labelWidth = 28
  const topPadding = 16
  const cols = 24
  const rows = 7
  const totalWidth = labelWidth + cols * (cellSize + cellGap)
  const totalHeight = topPadding + rows * (cellSize + cellGap)

  const hourLabels = [0, 3, 6, 9, 12, 15, 18, 21]

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      width="100%"
      role="img"
      aria-label="Coding hours heatmap"
    >
      {/* Hour labels */}
      {hourLabels.map((h) => (
        <text
          key={`hour-${h}`}
          x={labelWidth + h * (cellSize + cellGap) + cellSize / 2}
          y={10}
          fontSize={8}
          fill="var(--card-foreground)"
          opacity={0.6}
          fontFamily="monospace"
          textAnchor="middle"
        >
          {h.toString().padStart(2, '0')}
        </text>
      ))}

      {/* Day labels */}
      {DAY_LABELS.map((label, i) => (
        <text
          key={`day-${i}`}
          x={0}
          y={topPadding + i * (cellSize + cellGap) + cellSize - 2}
          fontSize={8}
          fill="var(--card-foreground)"
          opacity={0.5}
          fontFamily="monospace"
        >
          {label}
        </text>
      ))}

      {/* Cells */}
      {data.map(({ day, hour, count, level }) => (
        <rect
          key={`${day}-${hour}`}
          x={labelWidth + hour * (cellSize + cellGap)}
          y={topPadding + day * (cellSize + cellGap)}
          width={cellSize}
          height={cellSize}
          rx={2}
          fill={LEVEL_COLORS[level]}
        >
          <title>{`${DAY_LABELS[day]} ${hour.toString().padStart(2, '0')}:00 — ${count} commit${count !== 1 ? 's' : ''}`}</title>
        </rect>
      ))}
    </svg>
  )
}
