// src/pages/insights.page.js
import { expect } from '@playwright/test';

export class InsightsPageChannels {
  constructor(page) {
    this.page = page;

    this.insightsNav = page.getByTestId('/insights');
    this.channelsTab = page.getByText('Channels', { exact: true });
    this.videosTab = page.getByText('Videos', { exact: true });
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
  await expect(
    this.page.getByText(text, { exact: true }).first()).toBeVisible();
  }
}

export class ChannelsPagination {
  constructor(page) {
    this.page = page;

    // Results
    this.cards = page.locator('.research-card.channel');

    // Pagination
    this.page3 = page.getByRole('button', { name: '3' });
    this.page200 = page.getByRole('button', { name: '200' });
  }

  async expect32Results() {
    await expect(this.cards.first()).toBeVisible({ timeout: 30000 });
    await expect(this.cards).toHaveCount(32);
  }

  async goToPage3() {
    await this.page3.click();
  }

  async goToPage200() {
    await this.page200.click();
  }
}