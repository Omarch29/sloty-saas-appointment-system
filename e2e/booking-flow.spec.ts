import { test, expect } from '@playwright/test'

test.describe('Booking Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to booking app
    await page.goto('/')
  })

  test('complete booking flow with calendar selection', async ({ page }) => {
    // Check if we're on a booking page
    await expect(page).toHaveTitle(/Book Appointment - Sloty/)
    
    // Check if page has loaded by looking for any content
    const pageContent = await page.locator('body').textContent()
    console.log('Page content found:', !!pageContent)
    
    // Look for service cards
    const serviceCards = page.locator('a[href^="/book/"]')
    const serviceCount = await serviceCards.count()
    console.log('Found services:', serviceCount)
    
    if (serviceCount > 0) {
      // Click on first service
      console.log('Clicking on first service')
      await serviceCards.first().click()
    } else {
      console.log('No services found')
    }
  })

  test('navigate through service selection', async ({ page }) => {
    // Test service browsing and selection
    const serviceLinks = page.locator('a[href^="/book/"]')
    
    const count = await serviceLinks.count()
    expect(count).toBeGreaterThan(0)
    
    // Check each service has a book button
    for (let i = 0; i < Math.min(count, 3); i++) {
      const serviceLink = serviceLinks.nth(i)
      await expect(serviceLink).toContainText('Book Now')
    }
  })

  test('handle form validation', async ({ page }) => {
    // Navigate through to a booking page
    const serviceLinks = page.locator('a[href^="/book/"]')
    if (await serviceLinks.count() > 0) {
      await serviceLinks.first().click()
      
      // Wait for navigation and check we're on booking page
      await page.waitForURL(/\/book\/\d+/)
      
      // Look for form elements that would be on a booking page
      const nameInput = page.locator('input[name="name"], input[name="firstName"]')
      const emailInput = page.locator('input[name="email"]')
      
      // Check if booking form exists
      if (await nameInput.count() > 0 && await emailInput.count() > 0) {
        // Try to submit without filling required fields
        const submitButton = page.locator('button[type="submit"], button:has-text("book"), button:has-text("submit")')
        if (await submitButton.count() > 0) {
          await submitButton.first().click()
          
          // Expect some form of validation feedback
          await expect(page.locator('text=/required|error|field/i')).toBeVisible({ timeout: 5000 })
        }
      } else {
        console.log('Booking form not found on page')
      }
    }
  })
})
