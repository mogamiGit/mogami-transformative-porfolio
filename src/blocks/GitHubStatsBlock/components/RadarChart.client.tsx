'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ResponsiveRadar } from '@nivo/radar'

export type RadarDataPoint = {
  label: string
  value: number // 0-100
}

type RadarChartProps = {
  data: RadarDataPoint[]
}

// Memoised so the reveal's in-view re-render does not restart nivo's own transitions.
const Chart = React.memo(function Chart({ data }: RadarChartProps) {
  return (
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
          fontSize: 12,
          fontFamily: 'monospace',
        },
        grid: {
          line: {
            stroke: 'var(--border)',
            strokeOpacity: 0.4,
          },
        },
        // nivo's default tooltip is white, which hides the light `text.fill` above.
        tooltip: {
          container: {
            // Opaque: the card behind is translucent, so the chart would show through
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--primary)',
            borderRadius: 0,
            fontSize: 13,
            fontFamily: 'monospace',
          },
        },
      }}
      animate={true}
      motionConfig="gentle"
    />
  )
})

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  // The clipped element itself never intersects the viewport, so watch its wrapper.
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  if (data.length < 3) return null

  // Revealed with a clip-path rather than a scale: nivo sizes the chart from its
  // bounding box, which a transformed ancestor would shrink.
  return (
    <div ref={ref} className="h-full w-full min-h-50">
      <motion.div
        className="h-full w-full min-h-50"
        initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
        animate={inView ? { clipPath: 'circle(75% at 50% 50%)', opacity: 1 } : undefined}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Chart data={data} />
      </motion.div>
    </div>
  )
}
