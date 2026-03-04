import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page.js';
import { InsightsPageChannels, ChannelsPagination, ChannelsFiltersMin, ChannelsSuitabilityFilter } from '../src/pages/insights.page.js';

test.describe('Insights Tests (POM)', () => {

  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login (atomic mode)
    if (process.env.SKIP_LOGIN !== '1') {
      const login = new LoginPage(page);
      await login.loginWithOtp(
        process.env.EMAIL,
        process.env.PASSWORD
      );
    }
  });

  test('1 Search Functionality', async ({ page }) => {
    const insights = new InsightsPageChannels(page);
    // open Insights
    await insights.open();
    // search
    await insights.search('MrBeast');
    // verify result
    await insights.expectResultVisible('MrBeast');
  });

  test('2 Pagination: 32 results per page (Channels)', async ({ page }) => {
    const insights = new InsightsPageChannels(page);
    const pagination = new ChannelsPagination(page);
    // open Insights
    await insights.open();
    await expect(page).toHaveTitle(/ViewIQ/i);
    // page 1
    await pagination.expect32Results();
    // page 3
    await pagination.goToPage3();
    await pagination.expect32Results();
    // page 200
    await pagination.goToPage200();
    await pagination.expect32Results();
  });

  test('3 Filters - Set Min', async ({ page }) => {
    const insights = new InsightsPageChannels(page);
    const filters = new ChannelsFiltersMin(page);

    await insights.open();

    await filters.openFilters();

    const sections = [
      'ads_stats.average_cpv',
      'ads_stats.average_cpm',
      'ads_stats.ctr_v',
      'ads_stats.ctr',
      'ads_stats.video_view_rate',
      'stats.subscribers',
      'stats.last_30day_subscribers',
      'stats.last_30day_views',
      'stats.views_per_video'
    ];

    for (const id of sections) {
      const { expected, actual } = await filters.setMinAndValidate(id);
      expect(actual).not.toBe('');
      expect(actual).toBe(expected);
    }

  });

  test('4 Suitability Filter + Reset (POM)', async ({ page }) => {
    const insights = new InsightsPageChannels(page);
    const suitability = new ChannelsSuitabilityFilter(page);

    await insights.dismissSecurityModalIfPresent();
    await expect(page).toHaveTitle(/ViewIQ/i);

    await insights.open();
    await expect(page.getByText('Channels', { exact: true })).toBeVisible();

    await suitability.applyNotVetted();
    await suitability.expectNotVettedApplied();

    await suitability.resetAndExpectCleared();
  });

});