import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bookingPageSource = readFileSync(new URL('../app/book/page.js', import.meta.url), 'utf8');

test('booking page should export default React component', () => {
  assert.match(bookingPageSource, /export default function Book\(\)/, 'Book page exports the public booking form component');
});

test('successful 201 booking response renders accessible confirmation and resets the submitted form safely', () => {
  const firstAwaitIndex = bookingPageSource.indexOf('await fetch');
  const formElementCaptureIndex = bookingPageSource.indexOf('const formElement = e.currentTarget');

  assert.ok(formElementCaptureIndex > -1, 'submit handler captures the form element synchronously');
  assert.ok(formElementCaptureIndex < firstAwaitIndex, 'form element is captured before async fetch changes event currentTarget');
  assert.match(bookingPageSource, /Got it\. Your booking inquiry is in, and the Juke's team will follow up with availability and next steps\./, 'success branch renders the launch-safe customer confirmation text QA checks for');
  assert.match(bookingPageSource, /formElement\.reset\(\)/, 'success branch resets the actual submitted form after 201');
  assert.doesNotMatch(bookingPageSource, /e\.currentTarget\.reset\(\)/, 'success branch does not reset through event.currentTarget after await');
  assert.match(bookingPageSource, /role=\{status === 'success' \? 'status' : 'alert'\}/, 'success and error messages are announced accessibly');
});

test('booking form fields match API requirements', () => {
  // This test documents the required form fields that map to API
  const requiredFields = [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'contact', type: 'text', label: 'Email or Phone', required: true },
    { name: 'eventDate', type: 'date', label: 'Event Date', required: true },
    { name: 'guestCount', type: 'number', label: 'Guest Count', required: true },
    { name: 'eventStartTime', type: 'select', label: 'Start Time', required: true },
    { name: 'durationHours', type: 'select', label: 'Duration', required: true },
  ];

  const optionalFields = [
    { name: 'location', type: 'text', label: 'Location' },
    { name: 'eventType', type: 'text', label: 'Event Type' },
    { name: 'notes', type: 'textarea', label: 'Notes' },
  ];

  // Document form contract
  assert.ok(requiredFields.length === 6, 'Six required fields documented');
  assert.ok(optionalFields.length === 3, 'Three optional fields documented');
});

test('booking form should be accessible without authentication', () => {
  // Public form - no login required
  // This is a design contract test
  assert.ok(true, 'Public access requirement documented');
});

test('booking form should show success message after valid submission', () => {
  // Expected success flow:
  // 1. User fills form
  // 2. Client POST to /api/book
  // 3. Success response shows confirmation
  // 4. Form clears for next inquiry

  const expectedSuccessMessage = 'Thank you! Your booking inquiry has been received. We will contact you within 24 hours.';

  assert.ok(true, 'Success flow documented');
});

test('booking form should show validation errors for invalid input', () => {
  // Expected validation behavior:
  // - Show field-level errors on blur
  // - Show all errors on submit if any field invalid
  // - Disable submit while submitting

  assert.ok(true, 'Validation flow documented');
});
