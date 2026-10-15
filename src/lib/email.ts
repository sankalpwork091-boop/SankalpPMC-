import nodemailer from 'nodemailer';
import { siteConfig } from '@/data/siteConfig';

interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  encoding?: string;
}

interface SendEmailOptions {
  to?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
  const recipient = options.to || process.env.EMAIL_TO || siteConfig.email;
  const from = process.env.EMAIL_FROM || `"${siteConfig.shortName} Inquiries" <noreply@sankalppmc.com>`;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Check if SMTP is configured
  if (!host || !user || !pass) {
    console.warn(
      `[EMAIL NOT CONFIGURED] SMTP credentials missing in environment. Email not delivered to ${recipient}.`
    );
    console.log(`[EMAIL PREVIEW] Subject: ${options.subject}\nTo: ${recipient}\n\n${options.text}`);
    return { success: true, id: 'mock-dev-id' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from,
    to: recipient,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  });

  return { success: true, id: info.messageId };
}
