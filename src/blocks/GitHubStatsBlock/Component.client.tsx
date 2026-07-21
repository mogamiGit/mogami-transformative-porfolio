'use client'

import React from 'react'
import { Card, CardLabel, CardTitle } from '@/components/atoms/Card'
import { RadarChart } from './components/RadarChart.client'
import { HeatmapChart } from './components/HeatmapChart.client'
import { CodingHoursChart } from './components/CodingHoursChart.client'
import type {
  GitHubSkillScore,
  ContributionDay,
  GitHubTotals,
  CodingHourCell,
} from '@/utilities/github'

type Props = {
  label?: string | null
  title?: string | null
  skills: GitHubSkillScore[]
  showMetrics: boolean
  contributions: ContributionDay[]
  totals: GitHubTotals
  codingHours: CodingHourCell[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const statItems = [
  { key: 'streak', label: 'Current streak', suffix: ' days' },
  { key: 'contributions', label: 'Contributions', suffix: '' },
  { key: 'public', label: 'Public repos', suffix: '' },
  { key: 'private', label: 'Private repos', suffix: '' },
] as const

export const GitHubStatsClient: React.FC<Props> = ({
  label,
  title,
  skills,
  showMetrics,
  contributions,
  totals,
  codingHours,
}) => {
  const chartData = skills.length >= 3 ? skills.map((s) => ({ label: s.name, value: s.score })) : []

  const statValues: Record<string, number> = {
    streak: totals.currentStreak,
    contributions: totals.totalContributions,
    public: totals.publicRepos,
    private: totals.privateRepos,
  }

  return (
    <section className="container flex flex-col gap-4">
      {label && <CardLabel>{label}</CardLabel>}
      {title ?? 'github.stats'}
      <div className="grid grid-cols-4 gap-3.5">
        {chartData.length > 0 && (
          <Card className="col-span-4 row-span-1 md:col-span-2 md:row-span-4">
            <CardTitle>languages</CardTitle>
              <div className="flex-1">
                <RadarChart data={chartData} />
                {showMetrics && (
                  <div className="flex flex-row gap-1.5 mt-2">
                    {skills.map((s) => (
                      <span key={s.name} className="text-card-foreground text-[10px] opacity-60">
                        {s.name}: {s.score}/100 — {s.repoCount} repos, {formatBytes(s.totalBytes)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
          
          {codingHours.length > 0 && (
            <Card className="col-span-4 md:col-span-2 md:row-span-2">
              <CardTitle>coding-hours</CardTitle>
              <CodingHoursChart data={codingHours} />
            </Card>
          )}
          
          {statItems.map(({ key, label: statLabel, suffix }) => (
            <Card key={key}>
              <div className="text-center">
                <span className="text-2xl font-bold text-card-foreground font-mono">
                  {statValues[key].toLocaleString()}
                  {suffix}
                </span>
                <p className="text-card-foreground text-[10px] opacity-60 mt-1">{statLabel}</p>
              </div>
            </Card>
          ))}
            
          <Card className="col-span-4">
            <CardTitle>year contributions</CardTitle>
            <HeatmapChart data={contributions} />
        </Card>
      </div>
    </section>
  )
}
