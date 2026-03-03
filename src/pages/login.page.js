import { expect } from '@playwright/test';
import { getLatestEmail, clearInbox } from '../utils/mailosaur.js';
import { extractOtpFromMessage } from '../utils/otp.js';
import {
    BASE_URL,
    MAILOSAUR_API_KEY,
    MAILOSAUR_SERVER_ID
} from '../utils/env.js';

export class LoginPage {
    constructor(page) {
        this.page = page;

        this.usernameInput = page.locator('#userName');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.getByTestId('login-button-main');
        this.nextButton = page.getByTestId('next-button-main');
        this.otpBoxes = page.getByRole('textbox');
    }

    async loginWithOtp(email, password) {
        await clearInbox(MAILOSAUR_SERVER_ID, MAILOSAUR_API_KEY);

        await this.page.goto(BASE_URL);

        await this.usernameInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.nextButton.click();

        await expect(this.page.getByText(/Enter Validation Code/i)).toBeVisible();

        const message = await getLatestEmail(
            MAILOSAUR_SERVER_ID,
            MAILOSAUR_API_KEY,
            email
        );

        const otp = extractOtpFromMessage(message);

        await this.otpBoxes.first().click();
        await this.page.keyboard.type(otp);

        await this.page.waitForURL(/\/home/i);

        const skip = this.page.locator('span[data-dismiss="modal"]', { hasText: 'Skip for now' });
        if (await skip.isVisible().catch(() => false)) {
            await skip.click();
        }
    }
}