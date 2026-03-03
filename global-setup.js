import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from './src/pages/login.page.js';

dotenv.config();

async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const page = await context.newPage();
  const login = new LoginPage(page);

  await login.loginWithOtp(process.env.EMAIL, process.env.PASSWORD);

  await context.storageState({ path: 'storageState.json' });
  
  await context.close();
  await browser.close();
}

export default globalSetup;