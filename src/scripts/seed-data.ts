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
    description: richText('Open-source authentication library for Node.js with support for OAuth2, JWT and passwordless flows. Designed to be framework-agnostic and easy to integrate.'),
    techStack: [{ name: 'TypeScript' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Redis' }],
    tags: [{ tag: 'Open Source' }, { tag: 'Backend' }, { tag: 'Auth' }],
    buttons: [
      { text: 'GitHub', link: 'https://github.com', icon: 'external' as const },
      { text: 'Docs', link: 'https://nexauth.dev', icon: 'external' as const },
    ],
    repositoryLink: 'https://github.com/example/nexauth',
    client: 'Personal',
    featured: true,
    hasDetailPage: true,
    publishedAt: '2024-03-01T00:00:00.000Z',
  },
  {
    title: 'Orbitboard',
    description: richText('Real-time project management tool built for remote teams. Features kanban boards, time tracking, and Slack integration.'),
    techStack: [{ name: 'Next.js' }, { name: 'Prisma' }, { name: 'WebSockets' }, { name: 'Tailwind CSS' }],
    tags: [{ tag: 'SaaS' }, { tag: 'Full Stack' }, { tag: 'Real-time' }],
    buttons: [
      { text: 'Live demo', link: 'https://orbitboard.app', icon: 'external' as const },
    ],
    repositoryLink: 'https://github.com/example/orbitboard',
    client: 'Freelance',
    featured: true,
    hasDetailPage: true,
    publishedAt: '2024-06-15T00:00:00.000Z',
  },
  {
    title: 'Lumen UI',
    description: richText('Component library for React with 60+ accessible components. Built on top of Radix UI with a custom design system and dark mode support.'),
    techStack: [{ name: 'React' }, { name: 'TypeScript' }, { name: 'Storybook' }, { name: 'CSS Variables' }],
    tags: [{ tag: 'Open Source' }, { tag: 'Frontend' }, { tag: 'Design System' }],
    buttons: [
      { text: 'GitHub', link: 'https://github.com', icon: 'external' as const },
      { text: 'Storybook', link: 'https://lumen-ui.dev', icon: 'external' as const },
    ],
    repositoryLink: 'https://github.com/example/lumen-ui',
    client: 'Personal',
    featured: false,
    hasDetailPage: false,
    publishedAt: '2023-11-20T00:00:00.000Z',
  },
  {
    title: 'Trackvault',
    description: richText('CLI tool for tracking development time across Git repositories. Automatically logs commits and generates weekly reports in CSV or JSON.'),
    techStack: [{ name: 'Go' }, { name: 'SQLite' }, { name: 'Git' }],
    tags: [{ tag: 'CLI' }, { tag: 'Open Source' }, { tag: 'Developer Tools' }],
    buttons: [
      { text: 'GitHub', link: 'https://github.com', icon: 'external' as const },
    ],
    repositoryLink: 'https://github.com/example/trackvault',
    client: 'Personal',
    featured: false,
    hasDetailPage: false,
    publishedAt: '2023-08-05T00:00:00.000Z',
  },
  {
    title: 'Spectral API',
    description: richText('GraphQL API gateway with automatic schema stitching, rate limiting, and query cost analysis. Deployed on Cloudflare Workers for edge performance.'),
    techStack: [{ name: 'GraphQL' }, { name: 'Cloudflare Workers' }, { name: 'TypeScript' }, { name: 'Hono' }],
    tags: [{ tag: 'Backend' }, { tag: 'API' }, { tag: 'Edge' }],
    buttons: [
      { text: 'GitHub', link: 'https://github.com', icon: 'external' as const },
      { text: 'Live', link: 'https://spectral-api.dev', icon: 'external' as const },
    ],
    repositoryLink: 'https://github.com/example/spectral-api',
    client: 'Freelance',
    featured: true,
    hasDetailPage: true,
    publishedAt: '2024-09-10T00:00:00.000Z',
  },
  {
    title: 'Codebrief',
    description: richText('VS Code extension that generates plain-English summaries of code changes using AI. Integrates with GitHub PRs and writes draft descriptions automatically.'),
    techStack: [{ name: 'TypeScript' }, { name: 'VS Code API' }, { name: 'OpenAI' }, { name: 'GitHub API' }],
    tags: [{ tag: 'VS Code' }, { tag: 'AI' }, { tag: 'Developer Tools' }],
    buttons: [
      { text: 'Marketplace', link: 'https://marketplace.visualstudio.com', icon: 'external' as const },
      { text: 'GitHub', link: 'https://github.com', icon: 'external' as const },
    ],
    repositoryLink: 'https://github.com/example/codebrief',
    client: 'Personal',
    featured: false,
    hasDetailPage: false,
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
