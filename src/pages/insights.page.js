// src/pages/insights.page.js
import { expect } from '@playwright/test';

export class InsightsPage {
  constructor(page) {
    this.page = page;

    this.insightsNav = page.getByTestId('/insights');
    this.channelsTab = page.getByText('Channels');
    this.videosTab = page.getByText('Videos');
    this.skipForNow = page.getByText('Skip for now').first();
    this.searchBox = page.getByRole('searchbox');
  }

  async dismissSecurityModalIfPresent() {
    await this.skipForNow.waitFor({ state: 'visible', timeout: 2000 }).catch(() => { });
    if (await this.skipForNow.isVisible().catch(() => false)) {
      await this.skipForNow.click({ force: true });
      await this.skipForNow.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }
  }

  async open() {
    await this.dismissSecurityModalIfPresent();
    await this.insightsNav.waitFor({ state: 'visible', timeout: 30000 });
    await this.insightsNav.click();
  }

  async search(value) {
    await this.searchBox.fill(value);
    await this.searchBox.press('Enter');
  }

  async expectResultVisible(text) {
    await expect(this.page.getByText(text)).toBeVisible();
  }
}