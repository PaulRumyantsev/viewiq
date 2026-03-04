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

export class ChannelsFiltersMin {
  constructor(page) {
    this.page = page;

    this.filtersButton = page.getByText('Filters').first();
  }

  async openFilters() {
    await this.filtersButton.click();
  }

  async setMinAndValidate(sectionId) {

    const section = this.page.locator(`[id="${sectionId}"]`);

    const minButton = section.getByText('Min', { exact: true }).first();
    const input = section.locator('input').first();

    await minButton.click();

    const expected = await input.getAttribute('min');
    const actual = (await input.inputValue()).replace(/,/g, '');

    return { expected, actual };
  }
}

export class ChannelsSuitabilityFilter {
  constructor(page) {
    this.page = page;

    this.filtersBtn = page.getByText('Filters').first();
    this.applyBtn = page.getByText('Apply Filters');
    this.resetBtn = page.getByText('Reset');

    this.noOption = page.getByText(/^No\s*\(/).first();

    this.selectedBox = page.locator('.wide-box.selected');
    this.selectedCheck = page.locator('.wide-box.selected i.fa-check-circle');
  }

  async openFilters() {
    await this.filtersBtn.click();
  }

  async applyNotVetted() {
    await this.openFilters();
    await this.noOption.click();
    await this.applyBtn.click();
  }

  async expectNotVettedApplied() {
    await expect(this.page.getByText('Unvetted', { exact: true }).first()).toBeVisible();
    await this.openFilters();
    await expect(this.selectedBox.filter({ hasText: /^No\s*\(/ })).toBeVisible();
    await expect(this.selectedCheck).toBeVisible();
  }

  async resetAndExpectCleared() {
    await this.resetBtn.click();
    await expect(this.selectedBox.filter({ hasText: 'All' })).toBeVisible();
    await expect(this.selectedCheck).toBeVisible();
    await expect(this.page.getByText('Vetted', { exact: true }).first()).toBeVisible();
  }
}

// Videos tab page objects

export class InsightsPageVideos {
  constructor(page) {
    this.page = page;

    this.insightsNav = page.getByTestId('/insights');
    this.videosTab = page.getByText('Videos', { exact: true });

    this.skipForNow = page.getByText('Skip for now').first();
    this.searchBox = page.getByRole('searchbox');

    this.videoCards = page.locator('.research-card.video');
  }

  async dismissSecurityModalIfPresent() {
    await this.skipForNow.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    if (await this.skipForNow.isVisible().catch(() => false)) {
      await this.skipForNow.click({ force: true });
      await this.skipForNow.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }

  async open() {
    await this.dismissSecurityModalIfPresent();
    await this.insightsNav.waitFor({ state: 'visible', timeout: 30000 });
    await this.insightsNav.click();

    await this.videosTab.click({ timeout: 30000 });
    await expect(this.page.getByText('Videos', { exact: true })).toBeVisible({ timeout: 30000 });
  }

  async search(value) {
    await this.searchBox.fill(value);
    await this.searchBox.press('Enter');
  }

  async expectResultVisible(text) {
    await expect(this.videoCards.first()).toBeVisible({ timeout: 30000 });
    await expect(this.videoCards.filter({ hasText: text }).first()).toBeVisible({ timeout: 30000 });
  }
}

export class VideosPagination {
  constructor(page) {
    this.page = page;
    this.cards = page.locator('.research-card.video');
  }

  async expect32Results() {
    await expect(this.cards.first()).toBeVisible({ timeout: 30000 });
    await expect(this.cards).toHaveCount(32, { timeout: 30000 });
  }

  async goToPage(pageNumber) {
    await this.page.goto(`/insights/videos?page=${pageNumber}&sort=stats.views&sortAscending=false`);
  }

  async goToPage3() {
    await this.goToPage(3);
  }

  async goToPage200() {
    await this.goToPage(200);
  }
}

export class VideosFiltersMin {
  constructor(page) {
    this.page = page;
    this.filtersButton = page.getByText('Filters').first();
  }

  async openFilters() {
    await this.filtersButton.click();
  }

  async setMinAndValidate(sectionId) {
    const section = this.page.locator(`[id="${sectionId}"]`);
    await expect(section).toBeVisible({ timeout: 30000 });

    const minButton = section.getByText('Min', { exact: true }).first();
    const input = section.locator('input').first();

    await minButton.click();

    const expected = await input.getAttribute('min');
    const actual = (await input.inputValue()).replace(/,/g, '');

    return { expected, actual };
  }
}

export class VideosSuitabilityFilter {
  constructor(page) {
    this.page = page;

    this.filtersButton = page.getByText('Filters').first();
    this.applyButton = page.getByText('Apply Filters');
    this.resetButton = page.getByText('Reset');

    this.noOption = page.getByText(/^No\s*\(/).first();

    this.unvettedBadge = page.getByText('Unvetted', { exact: true });
    this.vettedBadge = page.getByText('Vetted', { exact: true });

    this.selectedBox = page.locator('.wide-box.selected');
    this.selectedCheck = page.locator('.wide-box.selected i.fa-check-circle');
  }

  async applyNotVetted() {
    await this.filtersButton.click();
    await this.noOption.click();
    await this.applyButton.click();
  }

  async expectNotVettedApplied() {
    await expect(this.unvettedBadge.first()).toBeVisible({ timeout: 30000 });

    await this.filtersButton.click();
    await expect(this.selectedBox.filter({ hasText: /^No\s*\(/ })).toBeVisible();
    await expect(this.selectedCheck).toBeVisible();
  }

  async resetAndExpectCleared() {
    await this.resetButton.click();

    await expect(this.selectedBox.filter({ hasText: 'All' })).toBeVisible();
    await expect(this.selectedCheck).toBeVisible();

    await expect(this.vettedBadge.first()).toBeVisible({ timeout: 30000 });
  }
}