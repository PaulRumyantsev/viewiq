// @ts-check
import dotenv from 'dotenv';
dotenv.config();
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  reporter: 'html',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // No parallel execution
  fullyParallel: false,
  workers: 1,

  // Global setup to perform login and save storage state
  globalSetup: './global-setup.js',

  use: {
    baseURL: process.env.BASE_URL || 'https://rc.viewiq.com',
    headless: !!process.env.CI ? true : false,
    permissions: ['geolocation'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Standard mode
    {
      name: 'atomic',
      use: { ...devices['Desktop Chrome'] },
    },

    // Fast mode with storageState
    {
      name: 'fast',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json',
      },
    },
  ],
});
