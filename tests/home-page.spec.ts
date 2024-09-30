import { test, expect } from '@playwright/test';

test('Portfolio has the expected title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vicente Ruiz - Portfolio/);
});
