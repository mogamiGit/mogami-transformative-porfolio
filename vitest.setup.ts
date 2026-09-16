import 'dotenv/config'

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Component specs render into a shared jsdom document. Without this, markup from
// one test is still mounted during the next, and queries match the wrong node.
afterEach(() => {
  cleanup()
})
