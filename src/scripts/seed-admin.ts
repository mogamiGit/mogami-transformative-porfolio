import type { SanitizedConfig } from 'payload'
import payload from 'payload'

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: process.env.SEED_ADMIN_EMAIL || 'admin@admin.com' } },
  })

  const apiKey = process.env.PAYLOAD_MCP_API_KEY

  if (existing.totalDocs > 0) {
    if (apiKey) {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          enableAPIKey: true,
          apiKey,
        },
      })
      payload.logger.info('Admin user already exists. API key updated.')
    } else {
      payload.logger.info('Admin user already exists, skipping.')
    }
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      name: 'Admin',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@admin.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'admin1234',
      ...(apiKey ? { enableAPIKey: true, apiKey } : {}),
    },
  })

  payload.logger.info('Admin user created.' + (apiKey ? ' API key set.' : ''))
  process.exit(0)
}
