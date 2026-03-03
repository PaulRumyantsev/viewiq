// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: true,
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,

  // Fast mode: 1st login before all tests, then reuse auth state for all tests.
  globalSetup: './global-setup.js',

  use: {
    baseURL: process.env.BASE_URL || 'https://rc.viewiq.com',
    headless: !!process.env.CI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    permissions: ['geolocation'],
    // autorisation reuse:
    storageState: 'storageState.json',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});