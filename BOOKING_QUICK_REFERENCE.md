# Booking Inquiry System - Quick Reference

## Public Endpoints

### Booking Form Page
**URL:** `/book`  
**Access:** Public (no authentication required)  
**Purpose:** Customer-facing form for catering/event booking inquiries

**Fields:**
- Name* (required)
- Email or Phone* (required)
- Event Date* (required)
- Guest Count* (required, minimum 1)
- Location (optional)
- Event Type (optional: wedding, corporate, birthday, graduation, reunion, other)
- Additional Notes (optional)

**Features:**
- Client-side validation
- Success message with 5-second auto-dismiss
- Clean, high-converting design with Tailwind CSS
- Mobile responsive

---

## API Endpoints

### Submit Booking Inquiry
**POST** `/api/book`  
**Access:** Public (no authentication)

**Request Body:**
```json
{
  "name": "Jane Smith",
  "contact": "jane@example.com",
  "eventDate": "2026-06-15",
  "location": "East Nashville",
  "guestCount": 75,
  "eventType": "wedding",
  "notes": "Looking for rehearsal dinner catering"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "inquiry": {
    "id": "inq_a1b2c3d4e5f6g7h8",
    "name": "Jane Smith",
    "contact": "jane@example.com",
    "eventDate": "2026-06-15",
    "location": "East Nashville",
    "guestCount": 75,
    "eventType": "wedding",
    "notes": "Looking for rehearsal dinner catering",
    "status": "new",
    "createdAt": "2026-05-08T21:30:00.000Z"
  },
  "slackNotified": false
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Booking inquiry guest count is required"
}
```

---

### List Booking Inquiries
**GET** `/api/book`  
**Access:** Dashboard authenticated users only

**Response:**
```json
{
  "inquiries": [
    {
      "id": "inq_a1b2c3d4e5f6g7h8",
      "name": "Jane Smith",
      "contact": "jane@example.com",
      "eventDate": "2026-06-15",
      "location": "East Nashville",
      "guestCount": 75,
      "eventType": "wedding",
      "notes": "Looking for rehearsal dinner catering",
      "status": "new",
      "createdAt": "2026-05-08T21:30:00.000Z"
    }
  ],
  "count": 1,
  "slackConfigured": false
}
```

---

## Dashboard Pages

### Bookings Dashboard
**URL:** `/dashboard/bookings`  
**Access:** Dashboard authenticated users only  
**Purpose:** Internal view of all booking inquiries

**Features:**
- Stats cards: Total, New, Last 7 Days
- Setup status banner (shows if Slack not configured)
- Sortable table with all inquiry details
- Link to public booking form
- Mobile responsive

**Setup Status:**
When `SLACK_WEBHOOK_URL` is not configured, displays:
- Info banner explaining Slack alerts are disabled
- Instructions: "Set SLACK_WEBHOOK_URL in .env.local to receive internal alerts"
- Assurance that bookings still work without Slack

---

## Environment Configuration

### Required (for development)
None - system works without any configuration

### Optional (for Slack notifications)
Add to `.env.local`:

```bash
# Optional: Slack webhook for booking inquiry internal alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**When configured:**
- Internal Slack alerts sent on new booking submissions
- Alert includes: name, contact, event details, suggested action, owner
- Failure to send Slack alert does NOT fail the booking submission

**When not configured:**
- Bookings still saved successfully
- Dashboard shows setup status banner
- No errors or failures

---

## Data Storage

**File:** `data/booking-inquiries.json`  
**Format:** JSON array of inquiry objects  
**Created:** Automatically on first submission  
**Backup:** Recommended to include in regular backups

---

## Testing

**Run all booking tests:**
```bash
npm test -- tests/booking*.test.mjs
```

**Test coverage:**
- Data layer validation (9 tests)
- API contracts (5 tests)
- Page contracts (5 tests)
- Dashboard contracts (4 tests)

---

## Security Notes

✅ Public form validates all input server-side  
✅ Dashboard endpoint requires authentication  
✅ No secrets exposed in code or config files  
✅ No customer-facing external notifications sent  
✅ Slack webhook is optional and internal-only  

---

## Support

For issues or questions, check:
- `BOOKING_INTAKE_SUMMARY.md` - Full implementation details
- `tests/booking*.test.mjs` - Test examples and contracts
- `.env.local.example` - Configuration reference
