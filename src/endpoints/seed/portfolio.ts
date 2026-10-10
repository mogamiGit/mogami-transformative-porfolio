import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Header } from '@/payload-types'

const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text, version: 1 }],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export const projects: RequiredDataFromCollectionSlug<'projects'>[] = [
  {
    title: 'Animate Your English',
    slug: 'animate-your-english',
    overview: richText(
      'Personal English tutoring website combining custom animations and a seamless user experience.',
    ),
    whatIBuilt: richText(
      "I was responsible for the complete development of a modern website for a private English teacher, working autonomously to deliver a solution tailored to the client's needs. I designed and implemented an intuitive, visually appealing interface using React and Tailwind CSS, ensuring a seamless and engaging user experience across devices.",
      'My work focused on creating reusable and well-structured components, optimizing the codebase for maintainability and scalability. I ensured best practices in accessibility and performance, and collaborated closely with the client to reflect their teaching style and values throughout the digital presence.',
      'The project highlights a responsive layout that adapts seamlessly across devices, ensuring clarity and usability for all visitors.',
      'Special emphasis was placed on interactive and animated experiences: advanced animations were integrated using Rive and Motion.dev, bringing dynamic, engaging motion to the interface. These animations not only enhance the visual appeal but also create a memorable and lively user experience throughout the site.',
    ),
    problem: richText(
      'A private English teacher needed an online presence that reflects their personality and teaching style, and makes it easy for prospective students to get in touch and book a lesson.',
    ),
    technicalDecisions: richText(
      'Astro 5 renders the page as static HTML and hydrates only the interactive pieces as React islands, so the site stays fast while still supporting rich animation.',
      'Rive drives the animated icons and Motion handles entrance and carousel transitions. The contact form sends through EmailJS, which avoids running a backend, and the site deploys to GitHub Pages from a GitHub Actions workflow on every push to main.',
    ),
    constraints: richText(
      'The site is fully static and hosted on GitHub Pages, so contact and booking had to work without a server.',
    ),
    outcome: richText('Live at jayfaris.nexolabs.xyz, built between April and June 2025.'),
    techStack: [
      { name: 'React' },
      { name: 'Astro' },
      { name: 'Tailwind CSS' },
      { name: 'TypeScript' },
      { name: 'Rive' },
      { name: 'Motion.dev' },
      { name: 'EmailJS' },
    ],
    tags: [
      { tag: 'Interactive Animations' },
      { tag: 'Component Architecture' },
      { tag: 'UI/UX Design' },
    ],
    buttons: [{ text: 'Visit Website', link: 'https://jayfaris.nexolabs.xyz/', icon: 'external' }],
    client: 'Jay Faris',
    status: 'completed',
    featured: true,
    publishedAt: '2025-06-17T00:00:00.000Z',
  },
  {
    title: 'Dynamic Knowledge Hub',
    slug: 'dynamic-knowledge-hub',
    overview: richText(
      'This website will serve as the official central hub for the community of philosopher and thinker Escohotado.',
    ),
    whatIBuilt: richText(
      'I contributed to the end-to-end creation of a website and knowledge community from scratch, working collaboratively with another developer. I was responsible for designing the interface, ensuring visual consistency and efficient component reuse throughout React by implementing a well-structured design system implemented in Storybook.',
      'I led the integration of functional components in the prototype, prioritizing optimization of the user experience and scalability. To ensure high-quality, secure code, I utilized advanced tools and approaches that facilitated the development of a robust solution.',
      'The project involved creating a dynamic grid to display various content types in an organized and flexible way, using a dynamic board concept.',
      'Components were designed to adjust to different screen sizes, ensuring a smooth, consistent user experience across devices. A parallax effect was applied to the books on hover, adding interactivity and enhancing the user experience.',
      'Between November 2024 and June 2025 I contributed the design system foundations (typography, colour, buttons, tags, inputs) plus the header and animated mobile menu, article and book cards, hero, carousels, comment section, newsletter subscription and five featured-grid layouts for the home page.',
    ),
    problem: richText(
      'The portal exists to preserve and share the work of Antonio Escohotado (books, articles, videos and quotes) with his community. The interface had to present very different content types consistently.',
    ),
    technicalDecisions: richText(
      'The UI lives in its own component library, documented in Storybook with autodocs and organised with Atomic Design, so components are designed and reviewed in isolation before reaching the app.',
      'The home grid uses CSS container queries and fluid clamp() typography, letting each featured card adapt to the space it is given rather than to the viewport. Carousels are built on Embla. The platform itself is a pnpm and Turborepo monorepo on Next.js App Router and Payload CMS.',
    ),
    constraints: richText(
      'Figma was the single source of truth for the design, and every component had to match it across breakpoints and browsers, including Safari-specific fixes.',
    ),
    techStack: [
      { name: 'Storybook' },
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Tailwind CSS' },
      { name: 'TypeScript' },
      { name: 'Motion.dev' },
    ],
    tags: [
      { tag: 'Interface Design' },
      { tag: 'Componentization' },
      { tag: 'Design System' },
      { tag: 'Dynamic Animations' },
    ],
    buttons: [
      {
        text: 'Design System Storybook',
        link: 'https://escohotado-design.nexolabs.dev/?path=/docs/atoms-button--docs',
        icon: 'external',
      },
    ],
    client: 'La Emboscadura SL',
    status: 'completed',
    featured: true,
    publishedAt: '2025-06-10T00:00:00.000Z',
  },
  {
    title: 'Dungeon Crawl',
    slug: 'dungeon-crawl',
    overview: richText(
      'Empowers Dungeon Masters (DMs) to effortlessly manage their parties and access crucial Dungeons & Dragons data, streamlining the game experience.',
    ),
    problem: richText(
      'Running a Dungeons & Dragons campaign means juggling party sheets, non-player characters and monster stats. Dungeon Crawl keeps them in one app for the Dungeon Master.',
    ),
    whatIBuilt: richText(
      'Campaigns with their players and non-player characters, each with create, edit and detail screens, form validation and photos picked from the library.',
      'A monster compendium loaded from the D&D 5e API, with a list filtered by initial and a detail view. A custom tab bar and horizontally paged card lists.',
      'Encounters are modelled and are the next feature in progress.',
    ),
    technicalDecisions: richText(
      'SwiftData models with cascade relationships between campaigns, players and encounters, so deleting a campaign cleans up everything under it. MVVM with the @Observable macro.',
      'Networking uses async/await over URLSession with typed errors, behind a persistence protocol so views can be previewed with sample data. Paged carousels use the iOS 17 scroll APIs: scrollTargetBehavior, containerRelativeFrame and scrollTransition.',
    ),
    constraints: richText('iOS 17 only, because it relies on SwiftData and the new scroll APIs.'),
    techStack: [
      { name: 'SwiftUI' },
      { name: 'SwiftData' },
      { name: 'Async Await' },
      { name: 'iOS 17 ScrollView' },
    ],
    tags: [{ tag: 'iOS 17' }],
    buttons: [
      {
        text: 'See the flow of dungeon',
        link: 'https://www.figma.com/proto/1P0S2xuMXPOnG1txYnEDmI/Dungeon-Crawl-DnD-App?node-id=593-5760&viewport=-1169%2C238%2C0.16&t=hSmtEpWWlch2yrjX-0&scaling=scale-down&starting-point-node-id=593%3A5760',
        icon: 'external',
      },
    ],
    githubRepo: 'mogamiGit/Dungeon-Crawl',
    status: 'completed',
    featured: true,
    publishedAt: '2024-02-25T00:00:00.000Z',
  },
  {
    title: 'OhTaku!',
    slug: 'ohtaku',
    overview: richText(
      'Discover and track your favorite anime. Dive into a vast database of titles, consult detailed information, and effortlessly track your progress with a tap.',
    ),
    whatIBuilt: richText(
      'A searchable anime catalogue with sorting by title or year in either direction and filtering by type (series, special, OVA, film).',
      'A detail screen with star rating, extra information and navigation to related titles. A watch list to track what you have seen, and an animated splash screen.',
    ),
    technicalDecisions: richText(
      'MVVM with an ObservableObject view model. The catalogue ships as a bundled JSON file that is copied to the documents directory on first launch; from then on the app reads and writes that copy, so the watch list persists with no backend or database.',
      'The file location is injected through a protocol, which lets previews run on test data. The splash animation uses Lottie.',
    ),
    constraints: richText('Fully offline: no network calls, all data is local.'),
    techStack: [{ name: 'SwiftUI' }, { name: 'Lottie animation' }, { name: 'Local management' }],
    tags: [{ tag: 'iOS 16' }],
    githubRepo: 'mogamiGit/Ohtaku',
    status: 'completed',
    featured: true,
    publishedAt: '2023-09-14T00:00:00.000Z',
  },
]

export const experiences: RequiredDataFromCollectionSlug<'experience'>[] = [
  {
    type: 'work',
    period: '2024 - today',
    organization: 'Freelance',
    role: 'Graphic designer & Frontend Developer',
    order: 1,
  },
  {
    type: 'work',
    period: '2019 - 2024',
    organization: 'Cheil Worldwide',
    role: 'Visual & Web Layout designer',
    order: 2,
  },
  {
    type: 'work',
    period: '2016 - 2019',
    organization: '8Belts',
    role: 'Graphic designer',
    order: 3,
  },
  {
    type: 'education',
    period: '2024',
    organization: 'Ironhack',
    role: 'Industrial applications of machine learning and AI',
    order: 4,
  },
  {
    type: 'education',
    period: '2023',
    organization: 'Apple Coding Academy',
    role: 'Swift Full Stack Bootcamp',
    order: 5,
  },
  {
    type: 'education',
    period: '2021',
    organization: 'CICE, Escuela Profesional de Nuevas Tecnologías',
    role: 'App Development Master',
    order: 6,
  },
  {
    type: 'education',
    period: '2018 - 2019',
    organization: 'CICE, Escuela Profesional de Nuevas Tecnologías',
    role: 'Web Design & Development Course',
    order: 7,
  },
  {
    type: 'education',
    period: '2011 - 2015',
    organization: 'ESNE',
    role: 'Graphic and Multimedia Design Degree',
    order: 8,
  },
]

type SkillData = RequiredDataFromCollectionSlug<'skills'>

const skillGroup = (
  names: string[],
  group: Pick<SkillData, 'skillType' | 'category'>,
): Omit<SkillData, 'order'>[] => names.map((name) => ({ name, ...group }))

export const skills: SkillData[] = [
  ...skillGroup(['HTML', 'CSS', 'JS', 'Swift'], { skillType: 'hard', category: 'languages' }),
  ...skillGroup(['React', 'Astro', 'Rive', 'Motion.dev', 'Svelte', 'SwiftUI', 'SwiftData'], {
    skillType: 'hard',
    category: 'frameworks',
  }),
  ...skillGroup(['MVVM', 'MVC'], { skillType: 'hard', category: 'patterns' }),
  ...skillGroup(['Figma', 'RESTful APIs', 'Postman', 'Git'], {
    skillType: 'hard',
    category: 'tools',
  }),
  ...skillGroup(['Design Thinking', 'Atomic Design', 'Mobile First', 'Agile'], {
    skillType: 'hard',
    category: 'methodologies',
  }),
  ...skillGroup(['Constantly changing', 'Self-taught', 'Problem solving', 'Teamwork'], {
    skillType: 'soft',
  }),
].map((skill, index) => ({ ...skill, order: index + 1 }))

export const headerNavItems: NonNullable<Header['navItems']> = [
  // Same order as the sections in `homePage.layout`, so the active marker advances left to right
  { link: { type: 'custom', label: 'About me', url: '/#about' } },
  { link: { type: 'custom', label: 'Skills', url: '/#skills' } },
  { link: { type: 'custom', label: 'Projects', url: '/#projects' } },
  { link: { type: 'custom', label: 'Experience', url: '/#experience' } },
  { link: { type: 'custom', label: 'Contact', url: '/#contact' } },
]

export const homePage: RequiredDataFromCollectionSlug<'pages'> = {
  title: 'Home',
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'none',
  },
  layout: [
    {
      blockType: 'portfolioHero',
      tagText: 'Open to Work',
      tagEmoji: '👩‍💻',
      role: 'Freelance Graphic Designer · Front-End Dev',
      heading: 'Hi, my name is Mónica Galán',
      description: richText(
        'Front-end Developer with a passion for web design and design systems. Skilled at crafting user-friendly and visually appealing interfaces, with a commitment to creating innovative web experiences and continuously advancing front-end development skills.',
      ),
    },
    {
      blockType: 'highlightPointsBlock',
      label: 'type: metrics',
      title: 'highlights.log',
      points: [
        { title: '8+', subtitle: 'Years of Experience' },
        { title: 'Multidisciplinary', subtitle: 'Professional profile' },
        { title: 'UX / UI', subtitle: 'Design passionate' },
      ],
    },
    {
      blockType: 'aboutBlock',
      sectionTitle: 'About me',
      bio: richText(
        "Hey you! I'm the creative mind behind the keyboard. Constantly on the move and infusing energy into every project.",
        'My mantra is simple: learn, design, develop, have fun, repeat! Because, honestly, why should the process of creating something incredible be boring? I love pushing boundaries, exploring new trends, and finding the perfect balance between functionality and style.',
        "Let's turn your digital dreams into vibrant realities together!",
      ),
      mantra: [
        { step: 'learn' },
        { step: 'design' },
        { step: 'develop' },
        { step: 'have fun' },
        { step: 'repeat' },
      ],
    },
    {
      blockType: 'skillsBlock',
      label: 'type: skills',
      title: 'skills.log',
      category: 'all',
    },
    {
      blockType: 'projectsBlock',
      sectionTitle: 'Projects',
      showFeaturedOnly: true,
      limit: 6,
    },
    {
      blockType: 'githubStatsBlock',
      label: 'type: github-stats',
      title: 'github.stats',
      months: '12',
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
      sectionTitle: 'Contact',
      email: 'mogami.creative@gmail.com',
      linkedinLabel: 'linkedin: monicagalandelallana',
      linkedinUrl: 'https://www.linkedin.com/in/monicagalandelallana',
    },
  ],
  meta: {
    title: 'Home',
    description:
      'Front-end Developer with a passion for web design and design systems. Skilled at crafting user-friendly and visually appealing interfaces.',
  },
}
