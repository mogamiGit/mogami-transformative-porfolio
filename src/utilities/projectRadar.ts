import type { RadarDataPoint } from '@/components/atoms/RadarChart/RadarChart.client'

const SKILL_SCORES: Record<string, number> = {
  TypeScript: 95, JavaScript: 85, React: 90, 'Next.js': 88, 'Node.js': 82,
  PostgreSQL: 75, Redis: 65, Prisma: 78, WebSockets: 60, 'Tailwind CSS': 85,
  'Radix UI': 70, Storybook: 65, 'CSS Variables': 72, Go: 68, SQLite: 55,
  Git: 90, GraphQL: 80, 'Cloudflare Workers': 62, Hono: 58, 'VS Code API': 55,
  OpenAI: 60, 'GitHub API': 65, Python: 70, Docker: 60, AWS: 65,
}

export function getProjectRadarData(
  techStack: { name: string; id?: string | null }[] | null | undefined,
): RadarDataPoint[] | null {
  if (!techStack || techStack.length < 3) return null

  return techStack.map((t) => ({
    label: t.name,
    value: SKILL_SCORES[t.name] ?? Math.floor(Math.random() * 40 + 50),
  }))
}
