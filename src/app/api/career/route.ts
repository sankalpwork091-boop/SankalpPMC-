import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';
import { siteConfig } from '@/data/siteConfig';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 5, 15 * 60 * 1000);

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

    let name = '';
    let email = '';
    let phone = '';
    let role = '';
    let experience = '';
    let message = '';
    let honeypot = '';
    let cvAttachment: { filename: string; content: Buffer } | undefined;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string) || '';
      email = (formData.get('email') as string) || '';
      phone = (formData.get('phone') as string) || '';
      role = (formData.get('role') as string) || '';
      experience = (formData.get('experience') as string) || '';
      message = (formData.get('message') as string) || '';
      honeypot = (formData.get('website_hp') as string) || '';

      const cvFile = formData.get('cv') as File | null;
      if (cvFile && cvFile.size > 0) {
        if (cvFile.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'CV file size exceeds 5MB limit. Please upload a smaller file or send via email.' },
            { status: 400 }
          );
        }

        const ext = '.' + cvFile.name.split('.').pop()?.toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return NextResponse.json(
            { error: 'Invalid file type. Only PDF and Word documents (.pdf, .doc, .docx) are accepted.' },
            { status: 400 }
          );
        }

        const bytes = await cvFile.arrayBuffer();
        cvAttachment = {
          filename: cvFile.name,
          content: Buffer.from(bytes),
        };
      }
    } else {
      const data = await request.json();
      name = data.name || '';
      email = data.email || '';
      phone = data.phone || '';
      role = data.role || '';
      experience = data.experience || '';
      message = data.message || '';
      honeypot = data.website_hp || '';
    }

    // Honeypot check
    if (honeypot) {
      console.warn(`[SPAM BLOCKED] Career honeypot triggered from IP ${ip}`);
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !role.trim()) {
      return NextResponse.json(
        { error: 'Please provide full name, email, phone number, and position.' },
        { status: 400 }
      );
    }

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
IP: ${ip}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c1421; color: #f5f2eb; padding: 24px; border-radius: 12px; border: 1px solid #d4a237;">
        <h2 style="color: #d4a237; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-top: 0;">
          New Career Application: ${role}
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 40%;">Candidate Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Position:</td>
            <td style="padding: 8px 0; color: #d4a237; font-weight: bold;">${role}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Experience:</td>
            <td style="padding: 8px 0; color: #ffffff;">${experience || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 8px 0; color: #ffffff;"><a href="tel:${phone}" style="color: #ffffff; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">CV Attachment:</td>
            <td style="padding: 8px 0; color: #ffffff;">${cvAttachment ? `📎 ${cvAttachment.filename}` : 'None'}</td>
          </tr>
        </table>

        ${
          message
            ? `
        <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #d4a237; display: block; margin-bottom: 8px;">Candidate Summary / Note:</strong>
          <p style="margin: 0; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${message}</p>
        </div>`
            : ''
        }

        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
          Sent from Sankalp PMC Careers Portal • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

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
    console.error('Career API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please email your CV directly to ' + siteConfig.email },
      { status: 500 }
    );
  }
}
