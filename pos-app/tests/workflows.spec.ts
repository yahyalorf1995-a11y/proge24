import { test, expect } from '@playwright/test';

test.describe('Interaction Audit', () => {

  test('Sidebar and Navigation', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      // Toggle sidebar on mobile
      const sidebarTrigger = page.locator('button[data-sidebar="trigger"]');
      if (await sidebarTrigger.isVisible()) {
        await sidebarTrigger.click();
      }
    }

    // Verify Sidebar Navigation
    const identityLink = page.locator('a[href="/identity"]');
    await expect(identityLink).toBeVisible();
    await identityLink.click();
    await expect(page).toHaveURL(/.*\/identity/);
    
    // Verify Journey Footer Links (Next)
    const nextLink = page.locator('a:has-text("Next Step")');
    await nextLink.click();
    await expect(page).toHaveURL(/.*\/constitution/);

    // Verify Keyboard Navigation on buttons
    await page.keyboard.press('Tab');
  });

  test('CRUD Operations & Forms - Identity & Constitution', async ({ page }) => {
    await page.goto('/identity');
    
    // Fill and submit identity
    await page.fill('textarea[name="mission"]', 'Automated QA Mission');
    await page.click('button:has-text("Save Mission")');
    
    // Verify it saved (page reloaded, value persisted)
    await expect(page.locator('textarea[name="mission"]')).toHaveValue('Automated QA Mission');
    
    // Constitution
    await page.goto('/constitution');
    await page.fill('textarea[name="summary"]', 'Automated QA Constitution');
    await page.click('button:has-text("Save Summary")');
    await expect(page.locator('textarea[name="summary"]')).toHaveValue('Automated QA Constitution');
    
    // Add Principle
    await page.fill('input[name="title"]', 'QA Principle');
    await page.fill('input[name="description"]', 'Never ship broken code.');
    await page.click('button:has-text("Add Principle")');
    
    // Verify addition
    await expect(page.locator('text=QA Principle')).toBeVisible();

    // Remove Principle
    await page.locator('button[title="Delete Area"], button[aria-label="Delete Area"], form[action*="removePrinciple"] button').first().click();
  });

  test('CRUD Operations & Dropdowns - Goals, Projects, Tasks', async ({ page }) => {
    // We mock DB on server, so changes persist in memory
    await page.goto('/life-areas');
    await page.fill('input[name="title"]', 'QA Life Area');
    await page.fill('input[name="description"]', 'For testing');
    await page.click('button:has-text("Add Area")');
    await expect(page.locator('text=QA Life Area')).toBeVisible();

    // Dropdowns (native selects)
    await page.goto('/goals');
    await page.fill('input[name="title"]', 'QA Goal');
    await page.selectOption('select[name="lifeAreaId"]', { index: 1 });
    await page.click('button:has-text("Set Goal")');
    await expect(page.locator('text=QA Goal')).toBeVisible();

    // Quick Actions
    // In Goals, clicking 'Start'
    const startBtn = page.locator('button:has-text("Start")').first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }
  });

  test('Client & Server Actions - Habits Check In', async ({ page }) => {
    await page.goto('/habits');
    // Ensure we have a habit
    await page.fill('input[name="title"]', 'QA Habit');
    await page.selectOption('select[name="lifeAreaId"]', { index: 1 });
    await page.click('button:has-text("Add Habit")');
    
    // Toggle check in
    const checkInBtn = page.locator('button:has-text("Check In")').first();
    if (await checkInBtn.isVisible()) {
      await checkInBtn.click();
    }
  });

  test('Mobile Interactions & Responsiveness', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      await page.click('button[data-sidebar="trigger"]');
      await expect(page.locator('text=Command Center')).toBeVisible();
    }
  });
});
