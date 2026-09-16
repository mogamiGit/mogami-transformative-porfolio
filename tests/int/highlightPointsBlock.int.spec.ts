import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

// `slugField()` marks slug unique, so these fixtures collide with themselves on a
// second run unless they are cleared. Clearing in beforeAll as well as afterAll
// keeps the suite runnable after a crashed run left rows behind.
const fixtureSlugs = ['highlight-points-round-trip', 'highlight-points-legacy-shape']

const removeFixtures = () =>
  payload.delete({ collection: 'pages', where: { slug: { in: fixtureSlugs } } })

describe('highlightPointsBlock schema', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
    await removeFixtures()
  })

  afterAll(async () => {
    await removeFixtures()
  })

  it('round-trips label, title and points', async () => {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: 'Highlight points round-trip',
        slug: 'highlight-points-round-trip',
        layout: [
          {
            blockType: 'highlightPointsBlock',
            label: 'type: metrics',
            title: 'highlights.log',
            points: [
              { title: '+5', subtitle: 'Years of experience' },
              { title: '+20', subtitle: 'Projects delivered' },
            ],
          },
        ],
      },
    })

    const read = await payload.findByID({ collection: 'pages', id: created.id })
    const block = read.layout?.[0]

    expect(block?.blockType).toBe('highlightPointsBlock')
    if (block?.blockType !== 'highlightPointsBlock') throw new Error('wrong block type')

    expect(block.label).toBe('type: metrics')
    expect(block.title).toBe('highlights.log')
    expect(block.points).toHaveLength(2)
    expect(block.points[0]).toMatchObject({ title: '+5', subtitle: 'Years of experience' })
  })

  // FR-015: content stored before the two fields existed must stay valid and saveable
  // with no editor action and no migration.
  it('accepts a block carrying points only, with no label and no title', async () => {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: 'Highlight points legacy shape',
        slug: 'highlight-points-legacy-shape',
        layout: [
          {
            blockType: 'highlightPointsBlock',
            points: [{ title: '+10', subtitle: 'Happy clients' }],
          },
        ],
      },
    })

    const read = await payload.findByID({ collection: 'pages', id: created.id })
    const block = read.layout?.[0]

    expect(block?.blockType).toBe('highlightPointsBlock')
    if (block?.blockType !== 'highlightPointsBlock') throw new Error('wrong block type')

    expect(block.points).toHaveLength(1)
    expect(block.label ?? null).toBeNull()
    expect(block.title ?? null).toBeNull()

    // Saving it again must not trip validation on the newly added fields.
    const resaved = await payload.update({
      collection: 'pages',
      id: created.id,
      data: { title: 'Highlight points legacy shape, resaved' },
    })

    expect(resaved.title).toBe('Highlight points legacy shape, resaved')
  })
})
