export function extractOtpFromMessage(message) {
    const body = message.text?.body || message.html?.body || '';

    const match = body.match(/\b(\d{3}-\d{3})\b/);

    if (!match) {
        throw new Error('OTP not found in email');
    }

    return match[1].replace('-', '');
}