import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { societyName, location, contactName, phone } = data;

    // Basic validation
    if (!societyName || !location || !contactName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a production setup, this sends an email/notification to careers@sankalppmc.com or CRM
    // For now we log and return success
    console.log('[Consultation Request]', {
      ...data,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Consultation request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
