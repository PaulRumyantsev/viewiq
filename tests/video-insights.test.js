import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page.js';
import { locators } from '../src/pages/locators.js';

test.describe('1 Search Functionality', () => {

  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/'); 
    if (process.env.SKIP_LOGIN === '1') return;
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('1 Search Functionality', async ({ page }) => {
    await locators.skipForNow(page).click({ timeout: 2000 }).catch(() => {});
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await locators.videosTab(page).click();
    await expect(page.getByText('Videos', { exact: true })).toBeVisible();
    await locators.searchVideos(page).fill('Jingle Toons');
    await locators.searchVideos(page).press('Enter');
    const cards = page.locator('.research-card.video');
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    await expect(cards.filter({ hasText: 'Jingle Toons' }).first()).toBeVisible({ timeout: 30000 });
    // await page.pause();
  });

});

test.describe('2 Insights: Pagination', () => {

  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/'); 
    if (process.env.SKIP_LOGIN === '1') return;
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('Pagination: 32 results per page (Videos)', async ({ page }) => {
    await locators.skipForNow(page).click({ timeout: 2000 }).catch(() => {});
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await locators.videosTab(page).click({ timeout: 30000 });
    await expect(page.getByText('Videos', { exact: true })).toBeVisible();
    for (const p of [1, 3, 200]) {
    await page.goto(`/insights/videos?page=${p}&sort=stats.views&sortAscending=false`);
    const cards = page.locator('.research-card.video');
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    await expect(cards).toHaveCount(32, { timeout: 30000 });
        }
    });

});

test.describe('3 Filters - Set Min', () => {

  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/'); 
    if (process.env.SKIP_LOGIN === '1') return;
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('3 Filters - Set Min', async ({ page }) => {
    await locators.skipForNow(page).click({ timeout: 2000 }).catch(() => {});
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await locators.videosTab(page).click({ timeout: 30000 });
    await expect(page.getByText('Videos', { exact: true })).toBeVisible();
    await locators.filtersPopoverButton(page).click();
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

      const section = page.locator(`[id="${id}"]`);
      await expect(section).toBeVisible({ timeout: 30000 });

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
    await page.goto('/');
    if (process.env.SKIP_LOGIN === '1') return;
    const login = new LoginPage(page);
    await login.loginWithOtp(
      process.env.EMAIL,
      process.env.PASSWORD
    );
  });

  test('4 Suitability Filter + Reset', async ({ page }) => {
    await locators.skipForNow(page).click({ timeout: 2000 }).catch(() => {});
    await expect(page).toHaveTitle(/ViewIQ/i);
    await locators.insightsNav(page).click();
    await locators.videosTab(page).click({ timeout: 30000 });
    await expect(page.getByText('Videos', { exact: true })).toBeVisible();
    await locators.filtersPopoverButton(page).click();

    await locators.filtersNoButton(page).click();
    await locators.filtersApplyButton(page).click();
    await locators.filtersPopoverButton(page).click();
    
    const unvettedBadge = page.getByText('Unvetted', { exact: true });
    await expect(unvettedBadge.first()).toBeVisible({ timeout: 30000 });

    await expect(page.locator('.wide-box.selected').filter({ hasText: /^No\s*\(/ })).toBeVisible();
    await expect(page.locator('.wide-box.selected i.fa-check-circle')).toBeVisible();
    await locators.filtersResetButton(page).click();
    await expect(page.locator('.wide-box.selected').filter({ hasText: 'All' })).toBeVisible();
    await expect(page.locator('.wide-box.selected i.fa-check-circle')).toBeVisible();

    const vettedBadge = page.getByText('Vetted', { exact: true });
    await expect(vettedBadge.first()).toBeVisible();

    
  });

});
