'use client'

import React from 'react'
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

export type RadarDataPoint = {
  label: string
  value: number // 0-100
}

type RadarChartProps = {
  data: RadarDataPoint[]
  size?: number
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
  if (data.length < 3) return null

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid
          stroke="var(--border)"
          strokeOpacity={0.4}
        />
        <PolarAngleAxis
          dataKey="label"
          tick={{
            fill: 'var(--card-foreground)',
            fontSize: 10,
            fontFamily: 'monospace',
            opacity: 0.8,
          }}
        />
        <Radar
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{
            r: 4,
            fill: 'var(--primary)',
            strokeWidth: 0,
          }}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
