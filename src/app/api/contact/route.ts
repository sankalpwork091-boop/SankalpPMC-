import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';
import { siteConfig } from '@/data/siteConfig';
import { validateRequestOrigin, validateJsonContentType } from '@/lib/csrf';
import { escapeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

const contactInputSchema = z
  .object({
    societyName: z.string().trim().min(1, 'Society name is required').max(200),
    location: z.string().trim().min(1, 'Location is required').max(200),
    members: z.string().trim().max(100).optional().default(''),
    contactName: z.string().trim().min(1, 'Contact name is required').max(100),
    role: z.string().trim().max(100).optional().default('Managing Committee Member'),
    phone: z
      .string()
      .trim()
      .min(8, 'Phone number must be at least 8 digits')
      .max(25)
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
    email: z
      .string()
      .max(150)
      .transform((val) => val.trim())
      .refine((val) => val === '' || z.string().email().safeParse(val).success, {
        message: 'Invalid email address',
      })
      .optional()
      .default(''),
    message: z.string().trim().max(3000).optional().default(''),
    website_hp: z.string().max(100).optional().default(''),
    company_url_hp: z.string().max(100).optional().default(''),
    _ts: z.union([z.string(), z.number()]).optional(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    // 1. CSRF / Origin verification
    if (!validateRequestOrigin(request)) {
      logger.warn('CSRF validation failed for contact form');
      return NextResponse.json(
        { error: 'Forbidden: Invalid request origin.' },
        { status: 403 }
      );
    }

    // 2. Content-Type check
    if (!validateJsonContentType(request)) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json.' },
        { status: 400 }
      );
    }

    // 3. Rate limiting (5 requests per 10 minutes)
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000, 'contact');

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${rateCheck.retryAfterSec} seconds before trying again, or call us directly at ${siteConfig.phones[0]}.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSec) },
        }
      );
    }

    // 4. Parse JSON payload safely
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    // 5. Schema validation
    const parsed = contactInputSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission data. Please verify all required fields.' },
        { status: 400 }
      );
    }

    const {
      societyName,
      location,
      members,
      contactName,
      role,
      phone,
      email,
      message,
      website_hp,
      company_url_hp,
      _ts,
    } = parsed.data;

    // 6. Spam protection: honeypot (reject only when filled) & optional time-to-submit (only when _ts is sent)
    const hasHoneypot = Boolean(website_hp?.trim()) || Boolean(company_url_hp?.trim());
    const submittedTs = _ts ? Number(_ts) : null;
    const isTooFast = submittedTs !== null && !isNaN(submittedTs) && Date.now() - submittedTs < 1500;

    if (hasHoneypot || isTooFast) {
      logger.warn('Spam suppression triggered for consultation request', {
        event: 'spam_blocked',
        hasHoneypot,
        isTooFast,
      });
      return NextResponse.json({ success: true, message: 'Consultation request received successfully.' });
    }

    // 7. Plain text email content
    const textContent = `
New Redevelopment Consultation Request

Society Details:
- Society Name: ${societyName}
- Location: ${location}
- Number of Flats / Members: ${members || 'Not specified'}

Contact Person:
- Name: ${contactName}
- Role / Designation: ${role || 'Managing Committee'}
- Phone: ${phone}
- Email: ${email || 'Not provided'}

Message / Query:
${message || 'No additional message provided.'}

Submission Metadata:
- Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
- Client IP: ${ip}
    `.trim();

    // 8. Sanitized HTML email content (defends against HTML/XSS injection in email clients)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c1421; color: #f5f2eb; padding: 24px; border-radius: 12px; border: 1px solid #d4a237;">
        <h2 style="color: #d4a237; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-top: 0;">
          New Redevelopment Consultation Request
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 40%;">Society Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${escapeHtml(societyName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Location / Node:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(location)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Flats / Members:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(members || 'Not specified')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Contact Person:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${escapeHtml(contactName)} (${escapeHtml(role || 'Committee')})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 8px 0; color: #d4a237; font-weight: bold;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(email || 'Not provided')}</td>
          </tr>
        </table>

        <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #d4a237; display: block; margin-bottom: 8px;">Society Inquiry / Notes:</strong>
          <p style="margin: 0; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${escapeHtml(message || 'None provided.')}</p>
        </div>

        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
          Sent from Sankalp PMC Website • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

    // 9. Dispatch notification email
    await sendEmail({
      replyTo: email ? email : undefined,
      subject: `[Website Inquiry] Consultation Request: ${societyName} (${location})`,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      { success: true, message: 'Consultation request received successfully.' },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error handling contact submission', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please contact us directly at ' + siteConfig.phones[0] },
      { status: 500 }
    );
  }
}
