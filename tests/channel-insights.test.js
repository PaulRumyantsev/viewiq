import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page.js';
import { locators } from '../src/pages/locators.js';

test.describe('1 Search Functionality', () => {

  test.setTimeout(80000);

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('1 Search Functionality', async ({ page }) => {
    await locators.skipForNow(page).click();
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await expect(page.getByText('Channels', { exact: true })).toBeVisible();
    await locators.searchChannels(page).fill('MrBeast');
    await locators.searchChannels(page).press('Enter');
    await expect(page.getByText('MrBeast', { exact: true })).toBeVisible();
    //await page.pause();
  });

});

test.describe('2 Insights: Pagination', () => {

  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('Pagination: 32 results per page (Channels)', async ({ page }) => {
    await locators.skipForNow(page).click();
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await expect(page.getByText('Channels', { exact: true })).toBeVisible();
    const cards = page.locator('.research-card.channel');
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    await expect(cards).toHaveCount(32);
    // Navigate to page 3
    await locators.page3(page).click();
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    await expect(cards).toHaveCount(32);
    // Navigate to page 200
    await locators.page200(page).click();
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    await expect(cards).toHaveCount(32);

  });

});

// This test is not a good practice (overengineering) for end-to-end testing, 
// but it serves as a direct validation of the API pagination behavior without relying on the UI.
//  In a real-world scenario, you would want to mock the API responses or 
// use a dedicated testing environment to avoid hitting production APIs directly.
test.describe('2 Insights: Pagination API GET', () => {

  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('Pagination: 32 results per page (Channels) API GET', async ({ page }) => {
    await locators.skipForNow(page).click({ timeout: 2000 }).catch(() => { });
    // Test pages 1, 3, and 200 with the API response payload
    for (const p of [1, 3, 200]) {
      const respPromise = page.waitForResponse(r =>
        r.url().includes('/api/v1/channels') &&
        r.url().includes('size=32') &&
        r.url().includes(`page=${p}`) &&
        r.ok()
      );
      // Trigger the API call by navigating to the pages
      await page.goto(
        `https://rc.viewiq.com/insights/channels?page=${p}&sort=stats.subscribers&sortAscending=false`
      );
      // Wait for the API response and validate the results
      const json = await (await respPromise).json();
      const items = json.data ?? json.items ?? json.results ?? json.channels ?? [];
      expect(items).toHaveLength(32);

    }
  });

});

test.describe('3 Filters - Set Min', () => {

  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('3 Filters - Set Min', async ({ page }) => {
    await locators.skipForNow(page).click();
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await expect(page.getByText('Channels', { exact: true })).toBeVisible();
    await locators.filtersPopoverButton(page).click();
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

      const section = page.locator(`[id="${id}"]`);
      const minButton = section.getByText('Min', { exact: true }).first();
      const input = section.locator('input').first();

      await minButton.click();

      const expected = await input.getAttribute('min');
      const actual = (await input.inputValue()).replace(/,/g, '');
      
      expect(actual).not.toBe('');
      expect(actual).toBe(expected);
    }
    
  });

});

test.describe('4 Suitability Filter + Reset', () => {

  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('4 Suitability Filter + Reset', async ({ page }) => {
    await locators.skipForNow(page).click();
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await expect(page.getByText('Channels', { exact: true })).toBeVisible();
    await locators.filtersPopoverButton(page).click();

    await locators.filtersNoButton(page).click();
    await locators.filtersApplyButton(page).click();
    await locators.filtersPopoverButton(page).click();
    
    const unvettedBadge = page.getByText('Unvetted', { exact: true });
    await expect(unvettedBadge.first()).toBeVisible();

    await expect(page.locator('.wide-box.selected').filter({ hasText: /^No\s*\(/ })).toBeVisible();
    await expect(page.locator('.wide-box.selected i.fa-check-circle')).toBeVisible();
    await locators.filtersResetButton(page).click();
    await expect(page.locator('.wide-box.selected').filter({ hasText: 'All' })).toBeVisible();
    await expect(page.locator('.wide-box.selected i.fa-check-circle')).toBeVisible();

    const vettedBadge = page.getByText('Vetted', { exact: true });
    await expect(vettedBadge.first()).toBeVisible();

    
  });

});