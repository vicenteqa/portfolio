import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
test('Portfolio has the expected title', async ({ page }) => {
  await expect(page).toHaveTitle(/Vicente Ruiz - Portfolio/);
});

test.only('Home Page - Has the expected appearance', async ({ page }) => {
  await page.waitForFunction(() => {
    const photoContainer = document.querySelector(
      '[data-testid="photo-container"]'
    );
    return (
      photoContainer && window.getComputedStyle(photoContainer).opacity === '1'
    );
  });
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.05 });
});
