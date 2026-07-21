import { unstable_cache } from 'next/cache'

export type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type GitHubTotals = {
  currentStreak: number
  totalContributions: number
  publicRepos: number
  privateRepos: number
}

export type CodingHourCell = {
  day: number // 0=Sun, 6=Sat
  hour: number // 0-23
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type GitHubSkillScore = {
  name: string
  score: number
  repoCount: number
  totalBytes: number
}

type GitHubRepo = {
  name: string
  full_name: string
  fork: boolean
  pushed_at: string
  language: string | null
}

type LanguageBytes = Record<string, number>

const GITHUB_API = 'https://api.github.com'

function getHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function fetchAllRepos(username: string, token: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const res = await fetch(
      `${GITHUB_API}/user/repos?per_page=${perPage}&page=${page}&affiliation=owner&sort=pushed`,
      { headers: getHeaders(token) },
    )

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
    }

    const batch: GitHubRepo[] = await res.json()
    repos.push(...batch)

    if (batch.length < perPage) break
    page++
  }

  return repos.filter((r) => !r.fork)
}

async function fetchRepoLanguages(fullName: string, token: string): Promise<LanguageBytes> {
  const res = await fetch(`${GITHUB_API}/repos/${fullName}/languages`, {
    headers: getHeaders(token),
  })

  if (!res.ok) return {}
  return res.json()
}

export function computeSkillScores(
  repos: GitHubRepo[],
  repoLanguages: Map<string, LanguageBytes>,
): GitHubSkillScore[] {
  const langStats = new Map<string, { totalBytes: number; repoCount: number; latestPush: number }>()

  for (const repo of repos) {
    const languages = repoLanguages.get(repo.full_name)
    if (!languages) continue

    const pushTime = new Date(repo.pushed_at).getTime()

    for (const [lang, bytes] of Object.entries(languages)) {
      const existing = langStats.get(lang) ?? { totalBytes: 0, repoCount: 0, latestPush: 0 }
      existing.totalBytes += bytes
      existing.repoCount += 1
      existing.latestPush = Math.max(existing.latestPush, pushTime)
      langStats.set(lang, existing)
    }
  }

  if (langStats.size === 0) return []

  const maxBytes = Math.max(...Array.from(langStats.values()).map((s) => s.totalBytes))
  const maxRepos = Math.max(...Array.from(langStats.values()).map((s) => s.repoCount))
  const now = Date.now()
  const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000

  const scores: GitHubSkillScore[] = []

  for (const [name, stats] of langStats) {
    const byteScore = stats.totalBytes / maxBytes
    const repoScore = stats.repoCount / maxRepos
    const ageMs = now - stats.latestPush
    const recencyScore = Math.max(0, 1 - ageMs / twoYearsMs)

    const score = Math.round((byteScore * 0.4 + repoScore * 0.3 + recencyScore * 0.3) * 100)

    scores.push({
      name,
      score,
      repoCount: stats.repoCount,
      totalBytes: stats.totalBytes,
    })
  }

  return scores.sort((a, b) => b.score - a.score)
}

async function fetchGitHubSkills(): Promise<GitHubSkillScore[]> {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) {
    console.warn('GITHUB_TOKEN or GITHUB_USERNAME not set — using mock data')
    return getMockSkills()
  }

  const repos = await fetchAllRepos(username, token)
  const repoLanguages = new Map<string, LanguageBytes>()

  const batches: GitHubRepo[][] = []
  for (let i = 0; i < repos.length; i += 10) {
    batches.push(repos.slice(i, i + 10))
  }

  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (repo) => {
        const langs = await fetchRepoLanguages(repo.full_name, token)
        return [repo.full_name, langs] as const
      }),
    )
    for (const [name, langs] of results) {
      repoLanguages.set(name, langs)
    }
  }

  return computeSkillScores(repos, repoLanguages)
}

function getMockSkills(): GitHubSkillScore[] {
  return [
    { name: 'TypeScript', score: 100, repoCount: 18, totalBytes: 4_200_000 },
    { name: 'JavaScript', score: 78, repoCount: 14, totalBytes: 2_800_000 },
    { name: 'CSS', score: 62, repoCount: 12, totalBytes: 1_500_000 },
    { name: 'HTML', score: 55, repoCount: 11, totalBytes: 980_000 },
    { name: 'Python', score: 42, repoCount: 5, totalBytes: 620_000 },
    { name: 'Go', score: 35, repoCount: 3, totalBytes: 410_000 },
    { name: 'Shell', score: 28, repoCount: 8, totalBytes: 150_000 },
    { name: 'Dockerfile', score: 18, repoCount: 6, totalBytes: 45_000 },
  ]
}

export const getGitHubSkills = unstable_cache(fetchGitHubSkills, ['github-skills'], {
  revalidate: 86400, // 24h
})

// --- GitHub Contributions Heatmap ---

const CONTRIBUTION_LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

async function fetchGitHubContributions(months: number): Promise<ContributionDay[]> {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) {
    console.warn('GITHUB_TOKEN or GITHUB_USERNAME not set — using mock contributions')
    return getMockContributions(months)
  }

  const to = new Date()
  const from = new Date()
  from.setMonth(from.getMonth() - months)

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`GitHub GraphQL error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks

  if (!weeks) {
    console.warn('No contribution data returned from GitHub')
    return []
  }

  const days: ContributionDay[] = []
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: day.date,
        count: day.contributionCount,
        level: CONTRIBUTION_LEVEL_MAP[day.contributionLevel] ?? 0,
      })
    }
  }

  return days
}

function getMockContributions(months: number): ContributionDay[] {
  const days: ContributionDay[] = []
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - months)

  const current = new Date(start)
  while (current <= end) {
    const count = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 12)
    const level: 0 | 1 | 2 | 3 | 4 =
      count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4

    days.push({
      date: current.toISOString().split('T')[0],
      count,
      level,
    })
    current.setDate(current.getDate() + 1)
  }

  return days
}

export const getGitHubContributions = (months: number = 12) =>
  unstable_cache(() => fetchGitHubContributions(months), ['github-contributions', String(months)], {
    revalidate: 86400,
  })()

// --- GitHub Totals (streak, contributions, repos) ---

export function computeStreak(contributions: ContributionDay[]): number {
  if (contributions.length === 0) return 0

  let streak = 0
  // Walk backwards from most recent day
  for (let i = contributions.length - 1; i >= 0; i--) {
    // Skip today if no contributions yet (streak still valid from yesterday)
    if (i === contributions.length - 1 && contributions[i].count === 0) continue
    if (contributions[i].count === 0) break
    streak++
  }

  return streak
}

async function fetchRepoCounts(): Promise<{ publicRepos: number; privateRepos: number }> {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) return { publicRepos: 42, privateRepos: 12 }

  const query = `
    query($username: String!) {
      user(login: $username) {
        publicRepos: repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
          totalCount
        }
        privateRepos: repositories(ownerAffiliations: OWNER, isFork: false, privacy: PRIVATE) {
          totalCount
        }
      }
    }
  `

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
  })

  if (!res.ok) return { publicRepos: 0, privateRepos: 0 }

  const json = await res.json()
  return {
    publicRepos: json.data?.user?.publicRepos?.totalCount ?? 0,
    privateRepos: json.data?.user?.privateRepos?.totalCount ?? 0,
  }
}

export const getGitHubTotals = unstable_cache(
  async (contributions: ContributionDay[]): Promise<GitHubTotals> => {
    const { publicRepos, privateRepos } = await fetchRepoCounts()
    const currentStreak = computeStreak(contributions)
    const totalContributions = contributions.reduce((sum, d) => sum + d.count, 0)

    return { currentStreak, totalContributions, publicRepos, privateRepos }
  },
  ['github-totals'],
  { revalidate: 86400 },
)

// --- Coding Hours (hour × day-of-week punch card) ---

function computeLevels(grid: number[][]): CodingHourCell[] {
  const cells: CodingHourCell[] = []
  const max = Math.max(1, ...grid.flat())

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const count = grid[day][hour]
      const ratio = count / max
      const level: 0 | 1 | 2 | 3 | 4 =
        count === 0 ? 0 : ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4
      cells.push({ day, hour, count, level })
    }
  }

  return cells
}

async function fetchCodingHours(): Promise<CodingHourCell[]> {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) {
    console.warn('GITHUB_TOKEN or GITHUB_USERNAME not set — using mock coding hours')
    return getMockCodingHours()
  }

  const to = new Date()
  const from = new Date()
  from.setFullYear(from.getFullYear() - 1)

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          commitContributionsByRepository(maxRepositories: 50) {
            contributions(first: 100) {
              nodes {
                occurredAt
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username, from: from.toISOString(), to: to.toISOString() },
    }),
  })

  if (!res.ok) return getMockCodingHours()

  const json = await res.json()
  const repos = json.data?.user?.contributionsCollection?.commitContributionsByRepository ?? []

  // 7 days × 24 hours grid
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))

  for (const repo of repos) {
    for (const node of repo.contributions?.nodes ?? []) {
      const date = new Date(node.occurredAt)
      grid[date.getDay()][date.getHours()]++
    }
  }

  return computeLevels(grid)
}

function getMockCodingHours(): CodingHourCell[] {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))

  // Simulate typical dev schedule: heavier on weekdays, 9-18h
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isWeekday = day >= 1 && day <= 5
      const isWorkHours = hour >= 9 && hour <= 18
      const isEvening = hour >= 20 && hour <= 23

      if (isWeekday && isWorkHours) {
        grid[day][hour] = Math.floor(Math.random() * 12) + 4
      } else if (isWeekday && isEvening) {
        grid[day][hour] = Math.floor(Math.random() * 5)
      } else if (!isWeekday && isWorkHours) {
        grid[day][hour] = Math.floor(Math.random() * 6)
      } else {
        grid[day][hour] = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0
      }
    }
  }

  return computeLevels(grid)
}

export const getGitHubCodingHours = unstable_cache(fetchCodingHours, ['github-coding-hours'], {
  revalidate: 86400,
})
