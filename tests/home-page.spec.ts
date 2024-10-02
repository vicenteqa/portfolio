import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
test('Portfolio has the expected title', async ({ page }) => {
  await expect(page).toHaveTitle(/Vicente Ruiz - Portfolio/);
});

test('Home has the expected appearance', async ({ page }) => {
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.05 });
});
