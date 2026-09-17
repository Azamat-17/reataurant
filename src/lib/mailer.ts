export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// No email provider is configured yet (no SMTP/Resend/SendGrid credentials in .env).
// Until one is wired in, the code is printed to the server log so registration can
// still be tested end-to-end locally.
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  console.log(`[mailer] Verification code for ${email}: ${code}`);
}
