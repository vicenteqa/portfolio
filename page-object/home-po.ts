import { type Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly photoContainerSelector: string;

  constructor(page: Page) {
    this.page = page;
    this.photoContainerSelector = '[data-testid="photo-container"]';
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForContainerFullyDisplayed(selector: string) {
    await this.page.waitForFunction((selector) => {
      const container = document.querySelector(selector);
      return container && window.getComputedStyle(container).opacity === '1';
    }, selector);
  }

  waitForPhotoContainer = () =>
    this.waitForContainerFullyDisplayed(this.photoContainerSelector);

  hasTheExpectedLayout = () =>
    expect(this.page).toHaveScreenshot({ maxDiffPixelRatio: 0.05 });
}
