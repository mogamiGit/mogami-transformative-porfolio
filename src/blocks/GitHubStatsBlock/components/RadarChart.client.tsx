'use client'

import React from 'react'
import { ResponsiveRadar } from '@nivo/radar'

export type RadarDataPoint = {
  label: string
  value: number // 0-100
}

type RadarChartProps = {
  data: RadarDataPoint[]
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  if (data.length < 3) return null

  return (
    <div className="h-full w-full min-h-50">
      <ResponsiveRadar
        data={data}
        keys={['value']}
        indexBy="label"
        maxValue={100}
        margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
        borderColor="var(--primary)"
        borderWidth={2}
        gridLevels={5}
        gridShape="linear"
        gridLabelOffset={12}
        enableDots={true}
        dotSize={8}
        dotColor="var(--primary)"
        dotBorderWidth={0}
        fillOpacity={0.15}
        colors={['var(--primary)']}
        theme={{
          text: {
            fill: 'var(--card-foreground)',
            fontSize: 10,
            fontFamily: 'monospace',
          },
          grid: {
            line: {
              stroke: 'var(--border)',
              strokeOpacity: 0.4,
            },
          },
        }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  )
}
