import { NextResponse } from 'next/server';

import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';
import {
  validateBookingInquiry,
  createBookingInquiry,
  getBookingInquiries,
} from '@/lib/booking-inquiry.mjs';

const BOOKING_EMAIL_TO = process.env.BOOKING_NOTIFICATION_TO || 'booking@jukesdiner.com';

/**
 * Send Slack notification for new booking inquiry
 * @param {Object} inquiry - The booking inquiry
 * @returns {Promise<boolean>} - True if notification sent successfully
 */
async function notifySlack(inquiry) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return false;
  }

  try {
    const payload = {
      text: '🍽️ New Booking Inquiry',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*New Booking Inquiry*',
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Name:*\n${inquiry.name}` },
            { type: 'mrkdwn', text: `*Contact:*\n${inquiry.contact}` },
            { type: 'mrkdwn', text: `*Event Date:*\n${inquiry.eventDate}` },
            { type: 'mrkdwn', text: `*Start Time:*\n${inquiry.eventStartTime || 'Not provided'}` },
            { type: 'mrkdwn', text: `*Duration:*\n${inquiry.durationHours || 'Not provided'} hours` },
            { type: 'mrkdwn', text: `*Guest Count:*\n${inquiry.guestCount}` },
          ],
        },
      ],
    };

    if (inquiry.location) {
      payload.blocks[1].fields.push({
        type: 'mrkdwn',
        text: `*Location:*\n${inquiry.location}`,
      });
    }

    if (inquiry.eventType) {
      payload.blocks[1].fields.push({
        type: 'mrkdwn',
        text: `*Event Type:*\n${inquiry.eventType}`,
      });
    }

    if (inquiry.notes) {
      payload.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Notes:*\n${inquiry.notes}`,
        },
      });
    }

    if (inquiry.googleCalendarLink) {
      payload.blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Add hold to booking@jukesdiner.com calendar' },
            url: inquiry.googleCalendarLink,
          },
        ],
      });
    }

    payload.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Suggested Next Action:*\nReview and respond within 24 hours\n*Owner:*\nBookings team`,
      },
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Slack notification failed:', response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Slack notification error:', error);
    return false;
  }
}

/**
 * Send email notification for new booking inquiry via Resend when configured.
 * The app still saves the inquiry if email is not configured or delivery fails.
 */
async function notifyEmail(inquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const from = process.env.BOOKING_NOTIFICATION_FROM || 'Juke\'s Diner <bookings@jukesdiner.com>';
  const subject = `New Juke's booking inquiry - ${inquiry.eventDate}`;
  const lines = [
    'New Juke\'s Diner booking inquiry',
    '',
    `Name: ${inquiry.name}`,
    `Contact: ${inquiry.contact}`,
    `Date: ${inquiry.eventDate}`,
    `Start time: ${inquiry.eventStartTime || 'Not provided'}`,
    `Duration: ${inquiry.durationHours || 'Not provided'} hours`,
    `Guest count: ${inquiry.guestCount}`,
    `Location: ${inquiry.location || 'Not provided'}`,
    `Event type: ${inquiry.eventType || 'Not provided'}`,
    `Notes: ${inquiry.notes || 'None'}`,
    '',
    inquiry.googleCalendarLink ? `Add hold to booking@jukesdiner.com Google Calendar: ${inquiry.googleCalendarLink}` : '',
  ].filter(Boolean);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [BOOKING_EMAIL_TO],
        subject,
        text: lines.join('\n'),
      }),
    });

    if (!response.ok) {
      console.error('Booking email notification failed:', response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Booking email notification error:', error);
    return false;
  }
}

/**
 * GET /api/book - Dashboard-only endpoint to list all booking inquiries
 */
export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const inquiries = getBookingInquiries();
    return NextResponse.json({
      inquiries,
      count: inquiries.length,
      slackConfigured: !!process.env.SLACK_WEBHOOK_URL,
      emailConfigured: !!process.env.RESEND_API_KEY,
      bookingEmailTo: BOOKING_EMAIL_TO,
    });
  } catch (error) {
    console.error('Booking inquiry GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load booking inquiries' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/book - Public endpoint to submit booking inquiry
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate the inquiry
    const validated = validateBookingInquiry(body);

    // Create the inquiry
    const inquiry = createBookingInquiry(validated);

    // Attempt internal notifications (non-blocking)
    let slackNotified = false;
    let emailNotified = false;
    try {
      slackNotified = await notifySlack(inquiry);
    } catch (error) {
      console.error('Slack notification failed but continuing:', error);
    }

    try {
      emailNotified = await notifyEmail(inquiry);
    } catch (error) {
      console.error('Email notification failed but continuing:', error);
    }

    return NextResponse.json(
      {
        success: true,
        inquiry,
        slackNotified,
        emailNotified,
        bookingEmailTo: BOOKING_EMAIL_TO,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create booking inquiry';
    const status = /required|must be/.test(message) ? 400 : 500;

    console.error('Booking inquiry POST error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
