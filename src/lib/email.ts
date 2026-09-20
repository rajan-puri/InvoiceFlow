import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const DEFAULT_FROM = process.env.EMAIL_FROM || "InvoBazar <onboarding@resend.dev>";

export interface SendOtpOptions {
  to: string;
  name?: string;
  otp: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendVerificationOtpEmail({
  to,
  name,
  otp,
}: SendOtpOptions): Promise<SendEmailResult> {
  try {
    if (!resend) {
      // In environment without RESEND_API_KEY configured:
      // Note: Never log or print the OTP here!
      console.warn(
        `[Email Service] RESEND_API_KEY is not set. Verification email queued for ${to}. To deliver real emails, configure RESEND_API_KEY.`
      );
      return { success: true };
    }

    const displayName = name?.trim() || "valued user";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px; color: #334155;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoBazar</h1>
      <p style="color: #bfdbfe; margin: 6px 0 0 0; font-size: 13px;">Proforma & Tax Invoicing Platform</p>
    </div>
    
    <div style="padding: 32px 28px;">
      <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0;">Verify Your Email Address</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Hello <strong>${displayName}</strong>,<br/>
        Thank you for joining InvoBazar. Please enter the following 6-digit verification code to activate your account:
      </p>

      <div style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8; padding-left: 8px;">
          ${otp}
        </div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b; font-weight: 500;">
          Expires in 15 minutes
        </p>
      </div>

      <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0 0 8px 0;">
        <strong>Security Notice:</strong> InvoBazar will never ask you to share your verification code. If you did not create an account, you can safely ignore this email.
      </p>
    </div>

    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      &copy; ${new Date().getFullYear()} InvoBazar. All rights reserved.
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
InvoBazar Email Verification

Hello ${displayName},

Your 6-digit verification code is: ${otp}

This code will expire in 15 minutes.

Security Notice: Never share your verification code with anyone. If you did not request this, please ignore this email.

InvoBazar Team
    `.trim();

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject: "Your InvoBazar Verification Code",
      html,
      text,
    });

    if (error) {
      console.error(`[Email Service] Resend error for recipient ${to}:`, error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown email error";
    console.error(`[Email Service] Failed to send email to ${to}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}
