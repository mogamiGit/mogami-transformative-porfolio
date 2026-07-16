import { unstable_cache } from 'next/cache'

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

async function fetchRepoLanguages(
  fullName: string,
  token: string,
): Promise<LanguageBytes> {
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
  const langStats = new Map<
    string,
    { totalBytes: number; repoCount: number; latestPush: number }
  >()

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
