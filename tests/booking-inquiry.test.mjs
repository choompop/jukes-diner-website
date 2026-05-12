import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateBookingInquiry,
  createBookingInquiry,
  getBookingInquiries,
} from '../lib/booking-inquiry.mjs';

test('booking inquiry validation rejects missing required fields', () => {
  assert.throws(
    () => validateBookingInquiry({}),
    /name is required/
  );

  assert.throws(
    () => validateBookingInquiry({ name: 'John Doe' }),
    /contact is required/
  );

  assert.throws(
    () => validateBookingInquiry({ name: 'John Doe', contact: 'john@example.com' }),
    /event date is required/
  );

  assert.throws(
    () => validateBookingInquiry({ name: 'John Doe', contact: 'john@example.com', eventDate: '2026-06-01' }),
    /guest count is required/
  );
});

test('booking inquiry validation accepts email or phone as contact', () => {
  const withEmail = {
    name: 'John Doe',
    contact: 'john@example.com',
    eventDate: '2026-06-01',
    guestCount: 50,
  };

  const withPhone = {
    name: 'Jane Smith',
    contact: '615-555-1234',
    eventDate: '2026-07-15',
    guestCount: 100,
  };

  assert.doesNotThrow(() => validateBookingInquiry(withEmail));
  assert.doesNotThrow(() => validateBookingInquiry(withPhone));
});

test('booking inquiry validation accepts valid complete inquiry', () => {
  const inquiry = {
    name: 'John Doe',
    contact: 'john@example.com',
    eventDate: '2026-06-01',
    eventStartTime: '11:00',
    durationHours: '4',
    location: 'Downtown Nashville',
    guestCount: 50,
    eventType: 'corporate',
    notes: 'Looking for BBQ catering for company picnic',
  };

  const validated = validateBookingInquiry(inquiry);
  assert.equal(validated.name, 'John Doe');
  assert.equal(validated.contact, 'john@example.com');
  assert.equal(validated.eventDate, '2026-06-01');
  assert.equal(validated.eventStartTime, '11:00');
  assert.equal(validated.durationHours, 4);
  assert.match(validated.googleCalendarLink, /calendar\.google\.com\/calendar\/render/);
  assert.match(validated.googleCalendarLink, /Juke%27s\+Diner\+booking\+hold/);
  assert.equal(validated.location, 'Downtown Nashville');
  assert.equal(validated.guestCount, 50);
  assert.equal(validated.eventType, 'corporate');
  assert.equal(validated.notes, 'Looking for BBQ catering for company picnic');
});

test('booking inquiry validation sanitizes guest count to integer', () => {
  const inquiry = {
    name: 'John Doe',
    contact: 'john@example.com',
    eventDate: '2026-06-01',
    guestCount: '75',
  };

  const validated = validateBookingInquiry(inquiry);
  assert.equal(typeof validated.guestCount, 'number');
  assert.equal(validated.guestCount, 75);
});

test('booking inquiry validation rejects invalid guest count', () => {
  assert.throws(
    () => validateBookingInquiry({
      name: 'John Doe',
      contact: 'john@example.com',
      eventDate: '2026-06-01',
      guestCount: 0,
    }),
    /guest count must be at least 1/
  );

  assert.throws(
    () => validateBookingInquiry({
      name: 'John Doe',
      contact: 'john@example.com',
      eventDate: '2026-06-01',
      guestCount: 'invalid',
    }),
    /guest count must be a number/
  );
});

test('booking inquiry validation builds Google Calendar hold links when time and duration are provided', () => {
  const validated = validateBookingInquiry({
    name: 'Calendar Customer',
    contact: 'calendar@example.com',
    eventDate: '2026-09-12',
    eventStartTime: '17:00',
    durationHours: '3',
    location: 'Nashville, TN',
    guestCount: 120,
  });

  assert.equal(validated.durationHours, 3);
  assert.match(validated.googleCalendarLink, /calendar\.google\.com\/calendar\/render/);
  assert.match(validated.googleCalendarLink, /dates=/);
  assert.match(validated.googleCalendarLink, /Calendar\+Customer/);
});

test('booking inquiry validation rejects invalid duration', () => {
  assert.throws(
    () => validateBookingInquiry({
      name: 'John Doe',
      contact: 'john@example.com',
      eventDate: '2026-06-01',
      guestCount: 50,
      durationHours: '18',
    }),
    /duration must be between/
  );
});

test('create booking inquiry stores validated inquiry with timestamp and id', () => {
  const inquiry = {
    name: 'John Doe',
    contact: 'john@example.com',
    eventDate: '2026-06-01',
    location: 'East Nashville',
    guestCount: 50,
    eventType: 'wedding',
    notes: 'Rehearsal dinner',
  };

  const created = createBookingInquiry(inquiry);

  assert.ok(created.id);
  assert.ok(created.createdAt);
  assert.equal(created.status, 'new');
  assert.equal(created.name, 'John Doe');
  assert.equal(created.contact, 'john@example.com');
  assert.equal(created.guestCount, 50);
});

test('get booking inquiries returns all stored inquiries', () => {
  const inquiry1 = {
    name: 'First Customer',
    contact: 'first@example.com',
    eventDate: '2026-06-01',
    guestCount: 50,
  };

  const inquiry2 = {
    name: 'Second Customer',
    contact: 'second@example.com',
    eventDate: '2026-07-01',
    guestCount: 75,
  };

  createBookingInquiry(inquiry1);
  createBookingInquiry(inquiry2);

  const inquiries = getBookingInquiries();
  assert.ok(inquiries.length >= 2);
  const names = inquiries.map((i) => i.name);
  assert.ok(names.includes('First Customer'));
  assert.ok(names.includes('Second Customer'));
});

test('booking inquiry does not send external messages', () => {
  // This test verifies the absence of external message sending behavior
  // by checking that createBookingInquiry doesn't require external credentials
  const inquiry = {
    name: 'Test Customer',
    contact: 'test@example.com',
    eventDate: '2026-08-01',
    guestCount: 100,
  };

  // Should succeed even without SLACK_WEBHOOK_URL or other external service credentials
  const previousSlackUrl = process.env.SLACK_WEBHOOK_URL;
  delete process.env.SLACK_WEBHOOK_URL;

  try {
    const created = createBookingInquiry(inquiry);
    assert.ok(created.id);
    assert.equal(created.status, 'new');
  } finally {
    if (previousSlackUrl) {
      process.env.SLACK_WEBHOOK_URL = previousSlackUrl;
    }
  }
});
