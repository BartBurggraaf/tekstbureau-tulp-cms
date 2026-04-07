import { test, expect } from '@playwright/test'

/**
 * Auth flow tests
 * Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in .env.local
 * to run the authenticated tests.
 */

const EMAIL    = process.env.TEST_ADMIN_EMAIL    ?? ''
const PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? ''

test.describe('Unauthenticated access', () => {
  test('/ redirects to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/dashboard redirects to /login when not logged in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/manual is accessible without login', async ({ page }) => {
    await page.goto('/manual')
    await expect(page).toHaveURL(/\/manual/)
    await expect(page.locator('h1')).toContainText('Manual')
  })

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Authenticated access', () => {
  test.skip(!EMAIL || !PASSWORD, 'Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in .env.local')

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })

  test('dashboard loads with metrics', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Total Pages')).toBeVisible()
    await expect(page.locator('text=Blog Posts')).toBeVisible()
  })

  test('sidebar shows all enabled nav items', async ({ page }) => {
    await expect(page.locator('nav a[href="/dashboard"]')).toBeVisible()
    await expect(page.locator('nav a[href="/manual"]')).toBeVisible()
  })

  test('navigating to /login redirects to /dashboard', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('manual page accessible while logged in', async ({ page }) => {
    await page.goto('/manual')
    await expect(page).toHaveURL(/\/manual/)
    await expect(page.locator('h1')).toContainText('Manual')
  })

  test('/manual has AI prompt section', async ({ page }) => {
    await page.goto('/manual')
    await expect(page.locator('#ai-prompt')).toBeVisible()
    await expect(page.locator('text=AI Setup Prompt')).toBeVisible()
  })

  test('sign out redirects to login', async ({ page }) => {
    await page.click('button:has-text("Sign out")')
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })
})
