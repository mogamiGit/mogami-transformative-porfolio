import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      // Integration: boots Payload and talks to the database.
      'tests/int/**/*.int.spec.ts',
      // Component: renders a single component in isolation, no database.
      'tests/unit/**/*.unit.spec.{ts,tsx}',
    ],
    // Every integration spec boots Payload against the same SQLite file. Running
    // spec files in parallel makes the second one fail with SQLITE_BUSY.
    fileParallelism: false,
  },
})
