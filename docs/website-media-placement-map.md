# Website Media Placement Map — Juke's Diner

Updated: 2026-05-11
Source of truth: Hermes Kanban + media hub approval status

Purpose: give the website a curated, conversion-focused plan for using Drive/media assets after Drive is connected. This is not a public asset dump. Every website placement should help visitors book catering/private events, trust the truck, crave the food, or understand the brand.

## Global rules

- Only publish assets marked approved and website-approved, or assets explicitly approved by John / the brand lead for public website use.
- Keep raw Drive folders private. The website should show selected derivatives, not every original upload.
- Do not publish private docs, customer/vendor PII, contract terms, invoices, raw event planning notes, license plates, payment details, or unapproved faces/minors.
- If an asset is interesting but not website-grade, keep it in the media hub, Metricool queue, social repurposing queue, or internal brand board.
- Every placement needs: ideal crop, required tags, approval criteria, fallback copy, and update cadence.

## Required approval tags

Baseline public-site tags:

- approved
- website-approved
- brand-safe
- public-ok when people, venues, customers, or third-party locations are visible

Conversion tags by use case:

- booking-cta
- catering-conversion
- food-proof
- truck
- social-proof
- press
- seasonal

## Placement map

| Slot | Use priority | Ideal asset type | Required tags | Approval criteria | Fallback copy | Update cadence |
|---|---:|---|---|---|---|---|
| Hero | Critical | One polished horizontal truck or food-truck-at-event photo; optional 5-8 second silent loop only if optimized. | approved, website-approved, brand-safe, hero, truck, booking-cta | Must instantly communicate Nashville food truck + retro diner energy; leave room for headline/CTA; no cluttered background, private addresses, messy operations, or sensitive details. | Smash burgers, hot chicken, waffle wheels, and a full event truck experience — served fast, loud, clean, and memorable. | Review monthly; change only when a clearly stronger hero asset is approved. |
| Menu highlights | Critical | Tight food photos: burgers, hot chicken, fries, waffle wheels, sauces, trays. | approved, website-approved, brand-safe, food-proof, menu, item-name | Food must be sharp, appetizing, well-lit, and actually orderable; no misleading portions or unavailable specials; alt text/menu mapping required. | Fan favorites built for lunch rushes, events, and late-night cravings. | Quarterly menu review; immediate update when item/pricing/availability changes. |
| Catering/private events | Critical | Event setup photos, serving windows, trays, private-party context, short recap clips. | approved, website-approved, brand-safe, catering-conversion, event, booking-cta | Show reliable service and clean setup; customer faces/venue/client names must be approved; pair with service style and inquiry CTA. | Bring Juke's to corporate lunches, festivals, weddings, late-night drops, and private parties. | Refresh after every approved high-quality event recap; otherwise monthly. |
| Truck | High | Clean exterior truck shots, service-window shots, route/location graphics. | approved, website-approved, brand-safe, truck, build-in-public, location | Truck must look clean, branded, reliable, and event-ready; avoid license plates, permit-sensitive details, or private property exposure. | The Juke's truck rolls into Nashville events with a diner-style setup built for speed and service. | Monthly route/season check; replace when wrap/equipment/setup changes. |
| Staff/story | Medium | Founder/operator photos, prep process, team service moments, training/system snapshots approved for public story. | approved, website-approved, brand-safe, staff, story, build-in-public | Permission for people shown; supports trust/operator discipline/franchise-readiness; no confidential SOPs, dashboards, financials, or PII. | Juke's is built by operators who care about fast service, clean systems, and food people remember. | Quarterly or after major team/franchise milestones. |
| Dining room/social proof | High | Busy-but-clean service photos, customer reactions with permission, testimonials, review cards, line/crowd proof. | approved, website-approved, brand-safe, social-proof, customer-permission | Shows demand without chaos; reviews/quotes must be reusable; faces/minors/venue names approved or obscured. | Built for the rush: memorable food, fast handoff, and a setup guests notice. | Monthly; add strongest approved proof from events/reviews. |
| Instagram/TikTok embeds or gallery | Medium | Approved top-performing embeds, 6-9 item curated gallery, or static thumbnails linking to social profiles. | approved, website-approved, brand-safe, social, embed-ok, performance-reviewed | Curated and fast-loading; no endless unmoderated feeds; supports food proof/event trust/booking intent; static fallback if embeds hurt performance/privacy. | See what Juke's is cooking, where the truck is rolling, and what the team is building next. | Biweekly during active campaigns; monthly otherwise. |
| Press/reviews | High | Press logos, review snippets, ratings screenshots where allowed, event organizer quotes, media mentions. | approved, website-approved, brand-safe, press, review, source-url, booking-cta | Accurate and reusable source; no inflated claims; place near booking CTA to reduce buyer hesitation. | Trusted for events, rushes, and Nashville food-truck moments that need to run smoothly. | Monthly; update within 72 hours of meaningful press/review win. |
| Seasonal campaigns | Medium | Limited-time menu shots, holiday/event graphics, festival recap photos, campaign-specific visuals. | approved, website-approved, brand-safe, seasonal, campaign, start-date, end-date | Dates, menu availability, pricing, and event details confirmed; removal date required; CTA points to book/find/order/follow. | Seasonal specials and event runs appear here when they are live and confirmed. | Before launch, mid-campaign check, remove within 24 hours after end date. |

## What not to do

- Do not auto-sync every Drive image to the website.
- Do not create a giant public gallery just because assets exist.
- Do not bury booking CTAs under media blocks.
- Do not use third-party social embeds as the only proof source.
- Do not publish internal dashboards, Slack screenshots, invoices, event contracts, or customer/vendor messages.

## Recommended website order

1. Hero: one strongest truck/food/event asset + Book the Truck CTA.
2. Menu highlights: 4-6 craveable approved food assets.
3. Catering/private events: proof block close to booking CTA.
4. Truck: trust/reliability/location visual.
5. Dining room/social proof or press/reviews: reduce booking hesitation.
6. Curated social gallery: optional, small, performance-safe.
7. Seasonal campaign rail: only when active and dated.
8. Staff/story: lower on page or About/Apply pages unless tied to franchise trust.

## Implementation notes

- Machine-readable version lives at `data/website-content-placement-map.json`.
- Marketing dashboard visibility is rendered on `/dashboard/marketing` so operators can see the placement rules before promoting assets.
- Asset promotion should happen from the media hub workflow: tag -> review -> approve -> place in a website slot.
- For Drive-connected assets, create web-optimized derivatives and store originals privately.
