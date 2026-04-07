import { test, expect } from '@playwright/test'

const EMAIL    = process.env.TEST_ADMIN_EMAIL    ?? ''
const PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? ''

test.describe('CMS pages (authenticated)', () => {
  test.skip(!EMAIL || !PASSWORD, 'Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in .env.local')

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })

  const cmsRoutes = [
    { path: '/dashboard', title: 'Dashboard' },
    { path: '/pages',     title: 'Pages' },
    { path: '/blog',      title: 'Blog' },
    { path: '/media',     title: 'Media' },
    { path: '/forms',     title: 'Forms' },
    { path: '/seo',       title: 'SEO' },
    { path: '/style',     title: 'Style' },
    { path: '/users',     title: 'Users' },
    { path: '/activity',  title: 'Activity' },
  ]

  for (const { path, title } of cmsRoutes) {
    test(`${path} loads without error`, async ({ page }) => {
      await page.goto(path)
      await expect(page).not.toHaveURL(/\/login/)
      // No unhandled error overlay
      await expect(page.locator('body')).not.toContainText('Application error')
      await expect(page.locator('body')).not.toContainText('500')
    })
  }

  test('style page shows color palette', async ({ page }) => {
    await page.goto('/style')
    await expect(page.locator('text=Color Palette')).toBeVisible()
    await expect(page.locator('text=Typography')).toBeVisible()
  })

  test('dashboard shows System Online badge', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=System Online')).toBeVisible()
  })
})
