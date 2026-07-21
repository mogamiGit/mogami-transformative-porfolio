'use client'

import React, { useMemo } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import type { ContributionDay } from '@/utilities/github'

type Props = {
  data: ContributionDay[]
}

export const HeatmapChart: React.FC<Props> = ({ data }) => {
  const { calendarData, from, to } = useMemo(() => {
    if (data.length === 0) return { calendarData: [], from: '', to: '' }

    const currentYear = new Date().getFullYear()
    const mapped = data
      .filter((d) => d.date !== '' && d.date >= `${currentYear}-01-01`)
      .map((d) => ({ day: d.date, value: d.count }))

    return {
      calendarData: mapped,
      from: `${currentYear}-01-01`,
      to: mapped[mapped.length - 1]?.day ?? `${currentYear}-12-31`,
    }
  }, [data])

  if (calendarData.length === 0) return null

  return (
    <div className="w-full h-35">
      <ResponsiveCalendar
        data={calendarData}
        from={from}
        to={to}
        emptyColor="var(--heatmap-0, #161b22)"
        colors={[
          'var(--heatmap-1, #0e4429)',
          'var(--heatmap-2, #006d32)',
          'var(--heatmap-3, #26a641)',
          'var(--heatmap-4, #39d353)',
        ]}
        margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
        yearSpacing={40}
        monthBorderColor="transparent"
        dayBorderWidth={2}
        dayBorderColor="var(--card, #0d1117)"
        theme={{
          text: {
            fill: 'var(--card-foreground)',
            fontSize: 10,
            fontFamily: 'monospace',
          },
          labels: {
            text: {
              fill: 'var(--card-foreground)',
              fontSize: 10,
              fontFamily: 'monospace',
            },
          },
        }}
        tooltip={({ day, value }) => (
          <div className="bg-card text-card-foreground border border-border px-2 py-1 rounded text-[11px] font-mono">
            {day}: {value ?? 0} contributions
          </div>
        )}
      />
    </div>
  )
}
