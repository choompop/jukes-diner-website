import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_DURATION_HOURS = 3;
const MAX_DURATION_HOURS = 12;
const DEFAULT_BOOKING_CALENDAR_ID = 'booking@jukesdiner.com';

function cleanOptional(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDurationHours(value) {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_DURATION_HOURS;
  }

  const duration = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (typeof duration !== 'number' || Number.isNaN(duration)) {
    throw new Error('Booking inquiry duration must be a number');
  }

  if (duration <= 0 || duration > MAX_DURATION_HOURS) {
    throw new Error(`Booking inquiry duration must be between 0 and ${MAX_DURATION_HOURS} hours`);
  }

  return duration;
}

function toCalendarDate(value) {
  return value.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function getBookingDateTimeRange(inquiry) {
  if (!inquiry?.eventDate || !inquiry?.eventStartTime) {
    return null;
  }

  const durationHours = parseDurationHours(inquiry.durationHours);
  const start = new Date(`${inquiry.eventDate}T${inquiry.eventStartTime}:00`);
  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return {
    start,
    end,
    startLabel: `${inquiry.eventDate} ${inquiry.eventStartTime}`,
    endLabel: `${end.getFullYear()}-${pad2(end.getMonth() + 1)}-${pad2(end.getDate())} ${pad2(end.getHours())}:${pad2(end.getMinutes())}`,
    durationHours,
  };
}

export function getBookingCalendarId() {
  return cleanOptional(process.env.BOOKING_CALENDAR_ID) || DEFAULT_BOOKING_CALENDAR_ID;
}

export function buildGoogleCalendarLink(inquiry) {
  const range = getBookingDateTimeRange(inquiry);
  if (!range) return '';

  const text = `Juke's Diner booking hold - ${inquiry.name || 'New inquiry'}`;
  const details = [
    `Customer: ${inquiry.name || ''}`,
    `Contact: ${inquiry.contact || ''}`,
    `Guest count: ${inquiry.guestCount || ''}`,
    `Event type: ${inquiry.eventType || ''}`,
    `Duration: ${range.durationHours} hour${range.durationHours === 1 ? '' : 's'}`,
    inquiry.notes ? `Notes: ${inquiry.notes}` : '',
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    src: getBookingCalendarId(),
    text,
    dates: `${toCalendarDate(range.start.toISOString()).slice(0, 15)}/${toCalendarDate(range.end.toISOString()).slice(0, 15)}`,
    details,
    location: inquiry.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const DATA_PATH = join(process.cwd(), 'data', 'booking-inquiries.json');

/**
 * Validate booking inquiry payload
 * @param {Object} inquiry - The inquiry to validate
 * @returns {Object} - Validated and sanitized inquiry
 * @throws {Error} - If validation fails
 */
export function validateBookingInquiry(inquiry) {
  if (!inquiry || typeof inquiry !== 'object') {
    throw new Error('Booking inquiry must be an object');
  }

  // Required fields
  if (!inquiry.name || typeof inquiry.name !== 'string' || inquiry.name.trim().length === 0) {
    throw new Error('Booking inquiry name is required');
  }

  if (!inquiry.contact || typeof inquiry.contact !== 'string' || inquiry.contact.trim().length === 0) {
    throw new Error('Booking inquiry contact is required');
  }

  if (!inquiry.eventDate || typeof inquiry.eventDate !== 'string' || inquiry.eventDate.trim().length === 0) {
    throw new Error('Booking inquiry event date is required');
  }

  if (inquiry.guestCount === undefined || inquiry.guestCount === null) {
    throw new Error('Booking inquiry guest count is required');
  }

  // Parse and validate guest count
  const guestCount = typeof inquiry.guestCount === 'string'
    ? parseInt(inquiry.guestCount, 10)
    : inquiry.guestCount;

  if (typeof guestCount !== 'number' || isNaN(guestCount)) {
    throw new Error('Booking inquiry guest count must be a number');
  }

  if (guestCount < 1) {
    throw new Error('Booking inquiry guest count must be at least 1');
  }

  const validated = {
    name: inquiry.name.trim(),
    contact: inquiry.contact.trim(),
    eventDate: inquiry.eventDate.trim(),
    eventStartTime: cleanOptional(inquiry.eventStartTime),
    durationHours: parseDurationHours(inquiry.durationHours),
    location: cleanOptional(inquiry.location),
    guestCount,
    eventType: cleanOptional(inquiry.eventType),
    notes: cleanOptional(inquiry.notes),
  };

  validated.googleCalendarLink = buildGoogleCalendarLink(validated);

  return validated;
}

/**
 * Create a new booking inquiry
 * @param {Object} inquiry - The inquiry data
 * @returns {Object} - Created inquiry with id, timestamp, and status
 */
export function createBookingInquiry(inquiry) {
  const validated = validateBookingInquiry(inquiry);

  const created = {
    id: `inq_${crypto.randomBytes(8).toString('hex')}`,
    ...validated,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  // Read existing inquiries
  const inquiries = readBookingInquiries();
  inquiries.push(created);

  // Write back to file
  writeFileSync(DATA_PATH, JSON.stringify(inquiries, null, 2), 'utf8');

  return created;
}

/**
 * Read booking inquiries from JSON file
 * @returns {Array} - Array of booking inquiries
 */
function readBookingInquiries() {
  try {
    const content = readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Get all booking inquiries
 * @returns {Array} - Array of booking inquiries
 */
export function getBookingInquiries() {
  return readBookingInquiries();
}
