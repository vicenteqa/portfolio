import { type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly photoContainerSelector: string;

  constructor(page: Page) {
    this.page = page;
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
    this.waitForContainerFullyDisplayed('[data-testid="photo-container"]');
}
