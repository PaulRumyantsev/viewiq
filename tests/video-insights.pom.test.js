import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page.js';
import { InsightsPageVideos, VideosPagination, VideosFiltersMin,VideosSuitabilityFilter } from '../src/pages/insights.page.js';

test.describe('Video Insights Tests (POM)', () => {

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

  test('1 Search Functionality (Videos)', async ({ page }) => {
    const insights = new InsightsPageVideos(page);

    await insights.open();
    await insights.search('Jingle Toons');
    await expect(insights.videoCards.first()).toBeVisible({ timeout: 30000 });
    await insights.expectResultVisible('Jingle Toons');
  });

  test('2 Pagination: 32 results per page (Videos)', async ({ page }) => {
    const insights = new InsightsPageVideos(page);
    const pagination = new VideosPagination(page);
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

  test('3 Filters - Set Min (Videos)', async ({ page }) => {
    test.setTimeout(60000); 
    const insights = new InsightsPageVideos(page);
    const filters = new VideosFiltersMin(page);

    await insights.open();
    await filters.openFilters();

    const sections = [
      'ads_stats.average_cpv',
      'ads_stats.average_cpm',
      'ads_stats.ctr_v',
      'ads_stats.ctr',
      'ads_stats.video_view_rate',
      'stats.views',
      'stats.last_day_views',
      'stats.channel_subscribers',
    ];

    for (const id of sections) {
      const { expected, actual } = await filters.setMinAndValidate(id);
      expect(actual).not.toBe('');
      expect(actual).toBe(expected);
    }
  });

  test('4 Suitability Filter + Reset (Videos)', async ({ page }) => {
    const insights = new InsightsPageVideos(page);
    const suitability = new VideosSuitabilityFilter(page);

    await insights.dismissSecurityModalIfPresent();
    await expect(page).toHaveTitle(/ViewIQ/i);

    await insights.open();
    await expect(page.getByText('Videos', { exact: true })).toBeVisible();

    await suitability.applyNotVetted();
    await suitability.expectNotVettedApplied();

    await suitability.resetAndExpectCleared();
  });

});