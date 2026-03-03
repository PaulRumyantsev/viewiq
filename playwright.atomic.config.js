// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();


export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  workers: 1,
  fullyParallel: false,
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: process.env.BASE_URL || 'https://rc.viewiq.com',
    headless: !!process.env.CI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    permissions: ['geolocation'],
    // Atomic mode: No storage state mode
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});