import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Project } from '../../../payload-types'

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/projects/${doc.slug}`

      payload.logger.info(`Revalidating project at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/projects/${previousDoc.slug}`

      payload.logger.info(`Revalidating old project at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/')
    }
  }
  return doc
}

export const revalidateDeleteProject: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/projects/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/')
  }

  return doc
}
