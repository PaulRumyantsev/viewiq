import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page.js';
import { InsightsPageChannels, ChannelsPagination } from '../src/pages/insights.page.js';

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

});