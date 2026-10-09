import type { SanitizedConfig } from 'payload'
import payload from 'payload'

import {
  experiences,
  headerNavItems,
  homePage,
  projects,
  skills,
} from '../endpoints/seed/portfolio'

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
        data: { ...project, _status: 'published' },
        draft: false,
      })
      payload.logger.info(`Updated project: ${project.title}`)
      continue
    }

    await payload.create({
      collection: 'projects',
      data: { ...project, _status: 'published' },
      draft: false,
    })

    payload.logger.info(`Created project: ${project.title}`)
  }

  for (const skill of skills) {
    const existing = await payload.find({
      collection: 'skills',
      where: { name: { equals: skill.name } },
    })

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'skills',
        id: existing.docs[0].id,
        data: skill,
      })
      payload.logger.info(`Updated skill: ${skill.name}`)
      continue
    }

    await payload.create({
      collection: 'skills',
      data: skill,
    })
    payload.logger.info(`Created skill: ${skill.name}`)
  }

  await payload.updateGlobal({
    slug: 'header',
    data: { navItems: headerNavItems },
    context: { disableRevalidate: true },
  })
  payload.logger.info('Updated header navigation')

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
  })

  if (existingHome.totalDocs > 0) {
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id,
      data: homePage,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info('Updated home page with blocks')
  } else {
    await payload.create({
      collection: 'pages',
      data: homePage,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info('Created home page with blocks')
  }

  payload.logger.info('Seed data complete.')
  process.exit(0)
}
