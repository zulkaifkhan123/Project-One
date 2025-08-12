import { Resend } from 'resend';
import { EmailTemplate } from '../components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "zulkaifkhan183@gmail.com"; // Replace with your actual admin email

export async function EmailVerification(email, username, statusOrCode) {
  try {
    const isVerification = /^\d+$/.test(statusOrCode.toString()); // number = verification code
    const subject = isVerification ? "Email Verification" : "Account Status Update";

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email, ADMIN_EMAIL],
      subject,
      react: EmailTemplate({
        username,
        verification_code: isVerification ? statusOrCode : null,
        status: isVerification ? null : statusOrCode
      }),
    });

    if (error) {
      return { success: false, message: "Failed to send email" };
    }

    return { success: true, message: "Email sent successfully to user and admin!" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, message: "Unexpected error while sending email" };
  }
}
