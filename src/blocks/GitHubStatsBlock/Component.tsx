import React from 'react'
import type { GitHubStatsBlockType } from '@/payload-types'
import {
  getGitHubSkills,
  getGitHubContributions,
  getGitHubTotals,
  getGitHubCodingHours,
} from '@/utilities/github'
import { GitHubStatsClient } from './Component.client'

export const GitHubStatsBlockComponent: React.FC<GitHubStatsBlockType> = async ({
  label,
  title,
  months,
  maxSkills,
  showMetrics,
}) => {
  const monthCount = months === '6' ? 6 : 12
  const [skills, contributions, codingHours] = await Promise.all([
    getGitHubSkills(),
    getGitHubContributions(monthCount),
    getGitHubCodingHours(),
  ])
  const totals = await getGitHubTotals(contributions)
  const slicedSkills = skills.slice(0, maxSkills ?? 8)

  return (
    <GitHubStatsClient
      label={label}
      title={title}
      skills={slicedSkills}
      showMetrics={showMetrics ?? false}
      contributions={contributions}
      totals={totals}
      codingHours={codingHours}
    />
  )
}
