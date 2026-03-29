import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: process.env.SEED_ADMIN_EMAIL || 'admin@admin.com' } },
  })

  if (existing.totalDocs > 0) {
    console.log('Admin user already exists, skipping.')
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

  console.log('Admin user created.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
