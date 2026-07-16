import type { SanitizedConfig } from 'payload'
import payload from 'payload'

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const projects = [
  {
    title: 'NexAuth',
    overview: richText('Open-source authentication library for Node.js with support for OAuth2, JWT and passwordless flows. Designed to be framework-agnostic and easy to integrate.'),
    problem: richText('Most Node.js auth libraries are tightly coupled to specific frameworks. Developers had to rewrite auth logic when switching between Express, Fastify, or Hono.'),
    whatIBuilt: richText('Framework-agnostic auth middleware with pluggable strategies for OAuth2, JWT, and magic links. Includes session management, CSRF protection, and built-in rate limiting.'),
    technicalDecisions: richText('Adapter pattern for framework compatibility. Redis for session store to handle horizontal scaling. PostgreSQL for persistent user data with row-level security.'),
    constraints: richText('Must support Node.js 18+ without native dependencies. Zero-config defaults for quick setup, but fully customizable for production.'),
    outcome: richText('2.4k GitHub stars. Adopted by 3 open-source projects. Featured in Node Weekly.'),
    techStack: [{ name: 'TypeScript' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Redis' }],
    tags: [{ tag: 'Open Source' }, { tag: 'Backend' }, { tag: 'Auth' }],
    buttons: [
      { text: 'Docs', link: 'https://nexauth.dev', icon: 'external' as const },
    ],
    githubRepo: 'mogamiGit/nexauth',
    client: 'Personal',
    status: 'maintained',
    featured: true,
    publishedAt: '2024-03-01T00:00:00.000Z',
  },
  {
    title: 'Orbitboard',
    overview: richText('Real-time project management tool built for remote teams. Features kanban boards, time tracking, and Slack integration.'),
    problem: richText('Remote teams juggled between Trello, Toggl, and Slack. Context-switching between tools caused lost updates and inaccurate time logs.'),
    whatIBuilt: richText('Unified workspace with kanban boards, built-in time tracking per task, real-time cursor presence, and bidirectional Slack sync for status updates.'),
    technicalDecisions: richText('WebSockets via Socket.io for real-time sync. Prisma with PostgreSQL for relational task data. Optimistic UI updates to feel instant despite network latency.'),
    constraints: richText('Had to support teams of 50+ with sub-100ms sync latency. Slack API rate limits required a queue-based integration.'),
    outcome: richText('Used by 12 teams internally at the client company. Reduced tool-switching by 60% according to user surveys.'),
    techStack: [{ name: 'Next.js' }, { name: 'Prisma' }, { name: 'WebSockets' }, { name: 'Tailwind CSS' }],
    tags: [{ tag: 'SaaS' }, { tag: 'Full Stack' }, { tag: 'Real-time' }],
    buttons: [
      { text: 'Live demo', link: 'https://orbitboard.app', icon: 'external' as const },
    ],
    githubRepo: 'mogamiGit/orbitboard',
    client: 'Freelance',
    status: 'active',
    featured: true,
    publishedAt: '2024-06-15T00:00:00.000Z',
  },
  {
    title: 'Lumen UI',
    overview: richText('Component library for React with 60+ accessible components. Built on top of Radix UI with a custom design system and dark mode support.'),
    problem: richText('Teams were copy-pasting component code between projects with inconsistent accessibility and theming. No shared source of truth.'),
    whatIBuilt: richText('60+ composable React components with WAI-ARIA compliance, CSS variable theming, dark mode, and full Storybook documentation with interactive examples.'),
    technicalDecisions: richText('Radix UI primitives for accessibility guarantees. CSS custom properties over CSS-in-JS for zero-runtime theming. Tree-shakeable ESM exports to minimize bundle size.'),
    constraints: richText('Must work in React 18+ and Next.js App Router. No runtime CSS-in-JS allowed due to RSC compatibility requirements.'),
    outcome: richText('Adopted across 4 internal projects. Reduced UI development time by ~40% for new features.'),
    techStack: [{ name: 'React' }, { name: 'TypeScript' }, { name: 'Storybook' }, { name: 'CSS Variables' }],
    tags: [{ tag: 'Open Source' }, { tag: 'Frontend' }, { tag: 'Design System' }],
    buttons: [
      { text: 'Storybook', link: 'https://lumen-ui.dev', icon: 'external' as const },
    ],
    githubRepo: 'mogamiGit/lumen-ui',
    client: 'Personal',
    status: 'maintained',
    featured: false,
    publishedAt: '2023-11-20T00:00:00.000Z',
  },
  {
    title: 'Trackvault',
    overview: richText('CLI tool for tracking development time across Git repositories. Automatically logs commits and generates weekly reports in CSV or JSON.'),
    problem: richText('Freelancers and agencies needed accurate time logs per project but hated manual time trackers. Git commit history was already there but unusable for billing.'),
    whatIBuilt: richText('CLI that hooks into git post-commit to log time automatically. Generates weekly/monthly reports in CSV or JSON. Supports multiple repos and clients.'),
    technicalDecisions: richText('Go for single-binary distribution with zero dependencies. SQLite for local storage — no server needed. Git hooks for passive tracking without workflow changes.'),
    constraints: richText('Must work offline-first. No background daemon — only runs on git events. Report format must be compatible with common invoicing tools.'),
    outcome: richText('800+ downloads on GitHub. Used personally to bill 1,200+ hours across 8 client projects.'),
    techStack: [{ name: 'Go' }, { name: 'SQLite' }, { name: 'Git' }],
    tags: [{ tag: 'CLI' }, { tag: 'Open Source' }, { tag: 'Developer Tools' }],
    buttons: [],
    githubRepo: 'mogamiGit/trackvault',
    client: 'Personal',
    status: 'archived',
    featured: false,
    publishedAt: '2023-08-05T00:00:00.000Z',
  },
  {
    title: 'Spectral API',
    overview: richText('GraphQL API gateway with automatic schema stitching, rate limiting, and query cost analysis. Deployed on Cloudflare Workers for edge performance.'),
    problem: richText('Microservices each exposed their own GraphQL schemas. Frontend teams had to query 4 different endpoints and merge data manually.'),
    whatIBuilt: richText('Unified GraphQL gateway that auto-stitches schemas from multiple services. Includes query cost analysis to prevent expensive queries, per-client rate limiting, and response caching.'),
    technicalDecisions: richText('Cloudflare Workers for edge deployment — sub-50ms cold starts globally. Hono as the HTTP framework for its minimal overhead. Schema stitching over federation for simpler service contracts.'),
    constraints: richText('Worker memory limit of 128MB. Must handle 10k req/s with p99 under 200ms. Services use different auth mechanisms that the gateway must normalize.'),
    outcome: richText('Serves 2M+ requests/day. Reduced frontend data-fetching code by 70%. Average response time: 45ms.'),
    techStack: [{ name: 'GraphQL' }, { name: 'Cloudflare Workers' }, { name: 'TypeScript' }, { name: 'Hono' }],
    tags: [{ tag: 'Backend' }, { tag: 'API' }, { tag: 'Edge' }],
    buttons: [
      { text: 'Live', link: 'https://spectral-api.dev', icon: 'external' as const },
    ],
    githubRepo: 'mogamiGit/spectral-api',
    client: 'Freelance',
    status: 'completed',
    featured: true,
    publishedAt: '2024-09-10T00:00:00.000Z',
  },
  {
    title: 'Codebrief',
    overview: richText('VS Code extension that generates plain-English summaries of code changes using AI. Integrates with GitHub PRs and writes draft descriptions automatically.'),
    problem: richText('Developers skip writing PR descriptions because it takes time. Reviewers then lack context, leading to slower reviews and missed issues.'),
    whatIBuilt: richText('VS Code extension that analyzes staged changes or PR diffs and generates structured summaries. One-click to insert as PR description via GitHub API.'),
    technicalDecisions: richText('VS Code extension API for tight editor integration. OpenAI API with structured prompts to keep summaries consistent. GitHub API for reading diffs and posting descriptions without leaving the editor.'),
    constraints: richText('Extension must work offline for diff analysis (AI call optional). Token budget per summary kept under 1k to minimize API cost. Must handle monorepo diffs with 100+ files.'),
    outcome: richText('500+ installs on VS Code Marketplace. Average PR description time reduced from 5 minutes to 15 seconds.'),
    techStack: [{ name: 'TypeScript' }, { name: 'VS Code API' }, { name: 'OpenAI' }, { name: 'GitHub API' }],
    tags: [{ tag: 'VS Code' }, { tag: 'AI' }, { tag: 'Developer Tools' }],
    buttons: [
      { text: 'Marketplace', link: 'https://marketplace.visualstudio.com', icon: 'external' as const },
    ],
    githubRepo: 'mogamiGit/codebrief',
    client: 'Personal',
    status: 'active',
    featured: false,
    publishedAt: '2024-01-18T00:00:00.000Z',
  },
]

const experiences = [
  {
    type: 'work' as const,
    period: '2024 - today',
    organization: 'Ironhack',
    role: 'Lead Frontend Instructor',
    description: 'Teaching modern web development with React, TypeScript and Next.js. Mentoring bootcamp students and designing curriculum.',
    order: 1,
  },
  {
    type: 'work' as const,
    period: '2019 - 2024',
    organization: 'Chailatte.CO',
    role: 'Full Stack Developer',
    description: 'Built and maintained e-commerce platforms and custom CMS solutions. Led migration from legacy PHP to Next.js stack.',
    order: 2,
  },
  {
    type: 'work' as const,
    period: '2016 - 2019',
    organization: 'ESKE',
    role: 'Frontend Developer',
    description: 'Developed responsive web applications and landing pages for agency clients. Implemented design systems and component libraries.',
    order: 3,
  },
  {
    type: 'education' as const,
    period: '2023',
    organization: 'Ironhack',
    role: 'Web Development Bootcamp',
    description: 'Intensive full-stack web development program covering JavaScript, React, Node.js and databases.',
    order: 4,
  },
  {
    type: 'education' as const,
    period: '2015 - 2016',
    organization: 'Universidad Complutense',
    role: 'Computer Science',
    description: 'Fundamentals of computer science, algorithms and data structures.',
    order: 5,
  },
]

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })

  for (const exp of experiences) {
    const existing = await payload.find({
      collection: 'experience',
      where: {
        organization: { equals: exp.organization },
        role: { equals: exp.role },
      },
    })

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'experience',
        id: existing.docs[0].id,
        data: exp,
      })
      payload.logger.info(`Updated experience: ${exp.role} @ ${exp.organization}`)
      continue
    }

    await payload.create({
      collection: 'experience',
      data: exp,
    })
    payload.logger.info(`Created experience: ${exp.role} @ ${exp.organization}`)
  }

  for (const project of projects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { title: { equals: project.title } },
    })

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: project as any,
        draft: false,
      })
      payload.logger.info(`Updated project: ${project.title}`)
      continue
    }

    await payload.create({
      collection: 'projects',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: project as any,
      draft: false,
    })

    payload.logger.info(`Created project: ${project.title}`)
  }

  // Seed home page with blocks
  const homePage = {
    title: 'Home',
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'portfolioHero',
        tagText: 'Available for work',
        tagEmoji: '👋',
        role: 'Full Stack Developer',
        heading: 'Building digital experiences that matter',
        description: richText(
          'I design and develop modern web applications with a focus on performance, accessibility, and great user experience.',
        ),
      },
      {
        blockType: 'highlightPointsBlock',
        points: [
          { title: '+5', subtitle: 'Years of experience' },
          { title: '+20', subtitle: 'Projects delivered' },
          { title: '+10', subtitle: 'Happy clients' },
        ],
      },
      {
        blockType: 'aboutBlock',
        sectionTitle: 'About me',
        bio: richText(
          'Passionate developer with experience building scalable web applications. I specialize in React, Next.js, and Node.js ecosystems. I love open source and contributing to the developer community.',
        ),
      },
      {
        blockType: 'projectsBlock',
        sectionTitle: 'Featured Projects',
        showFeaturedOnly: true,
        limit: 6,
      },
      {
        blockType: 'githubRadarBlock',
        label: 'type: github-radar',
        title: 'skills.radar',
        maxSkills: 8,
        showMetrics: false,
      },
      {
        blockType: 'experienceBlock',
        label: 'type: list',
        title: 'experience.log',
      },
      {
        blockType: 'contactBlock',
        sectionTitle: 'Get in touch',
        email: 'hello@example.com',
        linkedinLabel: 'LinkedIn',
        linkedinUrl: 'https://linkedin.com',
      },
    ],
  }

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
  })

  if (existingHome.totalDocs > 0) {
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: homePage as any,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info('Updated home page with blocks')
  } else {
    await payload.create({
      collection: 'pages',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: homePage as any,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info('Created home page with blocks')
  }

  payload.logger.info('Seed data complete.')
  process.exit(0)
}
