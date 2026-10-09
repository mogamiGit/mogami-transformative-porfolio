import 'dotenv/config'

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no IntersectionObserver, which the scroll-triggered animations rely
// on. Nothing ever intersects in a component spec, so a no-op is enough.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

globalThis.IntersectionObserver ??= IntersectionObserverStub

// Component specs render into a shared jsdom document. Without this, markup from
// one test is still mounted during the next, and queries match the wrong node.
afterEach(() => {
  cleanup()
})
