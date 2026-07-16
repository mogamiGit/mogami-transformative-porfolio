'use client'

import React from 'react'
import { Card, CardLabel, CardTitle } from '@/components/atoms/Card'
import { RadarChart } from '@/components/atoms/RadarChart/RadarChart.client'
import type { GitHubSkillScore } from '@/utilities/github'

type Props = {
  label?: string | null
  title?: string | null
  skills: GitHubSkillScore[]
  showMetrics: boolean
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const GitHubRadarClient: React.FC<Props> = ({ label, title, skills, showMetrics }) => {
  if (skills.length < 3) return null

  const chartData = skills.map((s) => ({
    label: s.name,
    value: s.score,
  }))

  return (
    <section className="container">
      <Card>
        {label && <CardLabel>{label}</CardLabel>}
        <CardTitle>{title ?? 'skills.radar'}</CardTitle>
        <RadarChart data={chartData} />
        {showMetrics && (
          <div className="flex flex-col gap-1.5 mt-2">
            {skills.map((s) => (
              <span key={s.name} className="text-card-foreground text-[10px] opacity-60">
                {s.name}: {s.score}/100 — {s.repoCount} repos, {formatBytes(s.totalBytes)}
              </span>
            ))}
          </div>
        )}
      </Card>
    </section>
  )
}
