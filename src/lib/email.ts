import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const resend = getResendClient();
  if (!resend) {
    console.log(`[email skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return;
  }

  try {
    await resend.emails.send({
      from: "Nuru <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export function bookingApprovedEmail(listingTitle: string) {
  return {
    subject: `Your booking request was approved — ${listingTitle}`,
    html: `
      <p>Good news — your booking request for <strong>${listingTitle}</strong> was approved.</p>
      <p>Log in to Nuru to complete payment and confirm your move-in.</p>
    `,
  };
}

export function bookingDeclinedEmail(listingTitle: string) {
  return {
    subject: `Update on your booking request — ${listingTitle}`,
    html: `
      <p>Your booking request for <strong>${listingTitle}</strong> was declined by the landlord.</p>
      <p>Browse other verified listings on Nuru to keep looking.</p>
    `,
  };
}

export function newBookingRequestEmail(listingTitle: string, studentName: string) {
  return {
    subject: `New booking request — ${listingTitle}`,
    html: `
      <p><strong>${studentName}</strong> requested to book your listing <strong>${listingTitle}</strong>.</p>
      <p>Log in to your Nuru dashboard to approve or decline the request.</p>
    `,
  };
}