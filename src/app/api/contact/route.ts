import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';
import { siteConfig } from '@/data/siteConfig';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 5, 15 * 60 * 1000);

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

    const data = await request.json();

    // Honeypot field protection — hidden input in form
    if (data.website_hp || data.company_url_hp) {
      console.warn(`[SPAM BLOCKED] Honeypot triggered from IP ${ip}`);
      // Return 200 so bot thinks it succeeded
      return NextResponse.json({ success: true });
    }

    const { societyName, location, members, contactName, role, phone, email, message } = data;

    // Strict validation
    if (!societyName?.trim() || !location?.trim() || !contactName?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Please provide society name, location, contact name, and phone number.' },
        { status: 400 }
      );
    }

    // Prepare email content
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
- IP Address: ${ip}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c1421; color: #f5f2eb; padding: 24px; border-radius: 12px; border: 1px solid #d4a237;">
        <h2 style="color: #d4a237; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-top: 0;">
          New Redevelopment Consultation Request
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 40%;">Society Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${societyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Location / Node:</td>
            <td style="padding: 8px 0; color: #ffffff;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Flats / Members:</td>
            <td style="padding: 8px 0; color: #ffffff;">${members || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Contact Person:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${contactName} (${role || 'Committee'})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 8px 0; color: #d4a237; font-weight: bold;"><a href="tel:${phone}" style="color: #d4a237; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 8px 0; color: #ffffff;">${email || 'Not provided'}</td>
          </tr>
        </table>

        <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #d4a237; display: block; margin-bottom: 8px;">Society Inquiry / Notes:</strong>
          <p style="margin: 0; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${message || 'None provided.'}</p>
        </div>

        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
          Sent from Sankalp PMC Website • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

    await sendEmail({
      replyTo: email?.trim() ? email.trim() : undefined,
      subject: `[Website Inquiry] Consultation Request: ${societyName} (${location})`,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      { success: true, message: 'Consultation request received successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please contact us directly at ' + siteConfig.phones[0] },
      { status: 500 }
    );
  }
}
