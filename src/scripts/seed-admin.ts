import type { SanitizedConfig } from 'payload'
import payload from 'payload'

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: process.env.SEED_ADMIN_EMAIL || 'admin@admin.com' } },
  })

  if (existing.totalDocs > 0) {
    payload.logger.info('Admin user already exists, skipping.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      name: 'Admin',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@admin.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'admin1234',
    },
  })

  payload.logger.info('Admin user created.')
  process.exit(0)
}
