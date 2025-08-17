import { test, expect } from '@playwright/test'

test('homepage has correct title and content', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/sloty/)

  // Expect the main heading to be visible
  await expect(page.locator('h1')).toContainText('Welcome to sloty')

  // Check for key feature cards
  await expect(page.locator('text=Multi-tenant')).toBeVisible()
  await expect(page.locator('text=Flexible Catalog')).toBeVisible()
  await expect(page.locator('text=Smart Booking')).toBeVisible()
  await expect(page.locator('text=Availability Engine')).toBeVisible()
})
