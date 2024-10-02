import { test, expect } from '@playwright/test';
import { HomePage } from '../page-object/home-po';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  await homePage.goto();
});
test('Portfolio has the expected title', async () => {
  await expect(homePage.page).toHaveTitle(/Vicente Ruiz - Portfolio/);
});

test('Home Page - Has the expected appearance', async () => {
  await homePage.waitForPhotoContainer();
  await expect(homePage.page).toHaveScreenshot({ maxDiffPixelRatio: 0.05 });
});
