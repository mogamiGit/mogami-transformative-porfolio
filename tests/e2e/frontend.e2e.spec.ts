import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Payload Website Template/)
    // The seeded home page has no hero (`hero.type: 'none'`); its first block is
    // portfolioHero, which renders the page's only h1. Asserting the role instead
    // of the copy keeps this smoke test from breaking on every wording edit.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
