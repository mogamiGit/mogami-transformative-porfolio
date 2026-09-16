import { defineConfig, devices } from '@playwright/test'

import 'dotenv/config'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* One worker everywhere. The devcontainer is capped at 1.5 CPUs / 4 GB, but
   * os.cpus() inside it reports the host's cores, so Playwright's default would
   * start four Chromiums next to the Next dev server and exhaust the cgroup. */
  workers: 1,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
  },
})
