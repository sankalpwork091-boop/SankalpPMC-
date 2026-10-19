import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';
import { siteConfig } from '@/data/siteConfig';
import { validateRequestOrigin } from '@/lib/csrf';
import { validateCvUpload, MAX_CV_FILE_SIZE } from '@/lib/fileValidation';
import { escapeHtml, sanitizeFilename } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

const careerTextSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z.string().trim().max(150).email('Invalid email address'),
    phone: z
      .string()
      .trim()
      .min(8, 'Phone number must be at least 8 digits')
      .max(25)
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
    role: z.string().trim().min(1, 'Role is required').max(100),
    experience: z.string().trim().max(100).optional().default(''),
    message: z.string().trim().max(3000).optional().default(''),
    website_hp: z.string().max(100).optional().default(''),
  })
  .strict();

export async function POST(request: Request) {
  try {
    // 1. CSRF / Origin verification
    if (!validateRequestOrigin(request)) {
      logger.warn('CSRF validation failed for career form');
      return NextResponse.json(
        { error: 'Forbidden: Invalid request origin.' },
        { status: 403 }
      );
    }

    // 2. Rate limiting (5 requests per 10 minutes)
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000, 'career');

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${rateCheck.retryAfterSec} seconds before trying again, or email your resume directly to ${siteConfig.email}.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSec) },
        }
      );
    }

    let parsedFields: Record<string, string> = {};
    let cvAttachment: { filename: string; content: Buffer; contentType?: string } | undefined;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      parsedFields = {
        name: (formData.get('name') as string) || '',
        email: (formData.get('email') as string) || '',
        phone: (formData.get('phone') as string) || '',
        role: (formData.get('role') as string) || '',
        experience: (formData.get('experience') as string) || '',
        message: (formData.get('message') as string) || '',
        website_hp: (formData.get('website_hp') as string) || '',
      };

      const cvFile = formData.get('cv') as File | null;
      if (cvFile && cvFile.size > 0) {
        if (cvFile.size > MAX_CV_FILE_SIZE) {
          return NextResponse.json(
            { error: 'CV file size exceeds 5MB limit. Please upload a smaller file or send via email.' },
            { status: 400 }
          );
        }

        const arrayBuffer = await cvFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Magic byte and extension validation
        const validation = validateCvUpload(buffer, cvFile.name);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || 'Invalid file uploaded. Only PDF, DOC, and DOCX are accepted.' },
            { status: 400 }
          );
        }

        // Clean filename removing path traversal and forbidden characters
        const safeOriginalName = sanitizeFilename(cvFile.name);
        cvAttachment = {
          filename: safeOriginalName,
          content: buffer,
          contentType: validation.mimeType,
        };
      }
    } else {
      let data: unknown;
      try {
        data = await request.json();
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
      }
      parsedFields = (data as Record<string, string>) || {};
    }

    // 3. Schema validation
    const parsed = careerTextSchema.safeParse(parsedFields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid application data. Please verify all required fields.' },
        { status: 400 }
      );
    }

    const { name, email, phone, role, experience, message, website_hp } = parsed.data;

    // 4. Honeypot check
    if (website_hp) {
      logger.warn('Career honeypot triggered', { event: 'career_honeypot_hit' });
      return NextResponse.json({ success: true, message: 'Application submitted successfully.' });
    }

    // 5. Plain text email
    const textContent = `
New Career Application Received

Candidate Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Position: ${role}
- Experience: ${experience || 'Not specified'}

Summary / Cover Note:
${message || 'None provided.'}

CV Attachment: ${cvAttachment ? cvAttachment.filename : 'No file attached'}
Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Client IP: ${ip}
    `.trim();

    // 6. Sanitized HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c1421; color: #f5f2eb; padding: 24px; border-radius: 12px; border: 1px solid #d4a237;">
        <h2 style="color: #d4a237; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-top: 0;">
          New Career Application: ${escapeHtml(role)}
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 40%;">Candidate Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Position:</td>
            <td style="padding: 8px 0; color: #d4a237; font-weight: bold;">${escapeHtml(role)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Experience:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(experience || 'Not specified')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">CV Attachment:</td>
            <td style="padding: 8px 0; color: #ffffff;">${cvAttachment ? `📎 ${escapeHtml(cvAttachment.filename)}` : 'None'}</td>
          </tr>
        </table>

        ${
          message
            ? `
        <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #d4a237; display: block; margin-bottom: 8px;">Candidate Summary / Note:</strong>
          <p style="margin: 0; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>`
            : ''
        }

        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
          Sent from Sankalp PMC Careers Portal • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

    // 7. Dispatch email
    await sendEmail({
      to: siteConfig.email,
      replyTo: email,
      subject: `[Job Application] ${role} — ${name}`,
      text: textContent,
      html: htmlContent,
      attachments: cvAttachment ? [cvAttachment] : undefined,
    });

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error handling career application', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please email your CV directly to ' + siteConfig.email },
      { status: 500 }
    );
  }
}
