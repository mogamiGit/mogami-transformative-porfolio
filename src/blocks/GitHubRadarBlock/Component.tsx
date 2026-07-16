import React from 'react'
import type { GitHubRadarBlockType } from '@/payload-types'
import { getGitHubSkills } from '@/utilities/github'
import { GitHubRadarClient } from './Component.client'

export const GitHubRadarBlockComponent: React.FC<GitHubRadarBlockType> = async ({
  label,
  title,
  maxSkills,
  showMetrics,
}) => {
  const skills = await getGitHubSkills()
  const sliced = skills.slice(0, maxSkills ?? 8)

  return (
    <GitHubRadarClient
      label={label}
      title={title}
      skills={sliced}
      showMetrics={showMetrics ?? false}
    />
  )
}
