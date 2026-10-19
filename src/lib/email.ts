import 'server-only';
import nodemailer from 'nodemailer';
import { siteConfig } from '@/data/siteConfig';
import { sanitizeHeader } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

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
  const recipient = sanitizeHeader(options.to || process.env.EMAIL_TO || siteConfig.email);
  const from = sanitizeHeader(
    process.env.EMAIL_FROM || `"${siteConfig.shortName} Inquiries" <noreply@sankalppmc.com>`
  );
  const subject = sanitizeHeader(options.subject);
  const replyTo = options.replyTo ? sanitizeHeader(options.replyTo) : undefined;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Check if SMTP is configured
  if (!host || !user || !pass) {
    logger.warn('SMTP credentials not configured. Email delivery skipped in development mode.', {
      event: 'email_dev_mock',
      recipientDomain: recipient.split('@')[1] || 'local',
    });
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
    replyTo,
    subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  });

  logger.info('Email dispatched successfully', {
    messageId: info.messageId,
  });

  return { success: true, id: info.messageId };
}
