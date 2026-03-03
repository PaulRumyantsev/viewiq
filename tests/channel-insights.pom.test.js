import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page.js';
import { InsightsPage } from '../src/pages/insights.page.js';

test.setTimeout(30000);

test('1 Search Functionality', async ({ page }) => {
  await page.goto('/');
  if (process.env.SKIP_LOGIN === '1') return;
  // 1) Login
  const login = new LoginPage(page);
  await login.loginWithOtp(process.env.EMAIL, process.env.PASSWORD);

  // 2) Insights actions
  const insights = new InsightsPage(page);

  // close modal if it appears
  await insights.dismissSecurityModalIfPresent();

  // 3) Open Insights -> Channels -> Search
  await insights.open();
  await insights.search('MrBeast');

  // 4) Assert result
  await expect(page.getByText('MrBeast', { exact: true }).first()).toBeVisible();
});