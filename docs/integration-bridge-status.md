# Juke's Integration Bridge Status

_Last updated: 2026-05-12_

## Connected / verified

- **Google Workspace (Hermes side)**: OAuth token is authenticated and refreshes successfully in the default Hermes profile.
- **Google Drive**: Hermes can read Juke's Drive assets, including menu images and the Juke's Content Library Index.
- **Google Calendar**: Hermes can read the booking calendar and upcoming Juke's events.
- **Flo / Slack**: `jukes-social-agent` gateway is running in the Juke's Diner Slack workspace as Flo. Joined channels include `#all-jukes-diner` and `#growth`.
- **Website / dashboard production auth**: Vercel production now has dashboard auth env vars set and `/api/auth` was smoke-tested successfully.
- **Website deployment hygiene**: `.vercelignore` prevents local env files and generated QA artifacts from being uploaded with Vercel deploys.

## Needs credentials or explicit approval before full production bridge

- **Stripe**: Production needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and any Connect account IDs (`STRIPE_ACCOUNT_EVENT_TRUCK`, `STRIPE_ACCOUNT_TRAILER_PARK`, `STRIPE_ACCOUNT_EAST_NASHVILLE`, `STRIPE_ACCOUNT_CORPORATE`). Use read-only/reporting first. Do not create charges/refunds/transfers without John approval.
- **Google Workspace from Vercel runtime**: Hermes has OAuth access locally. The website/dashboard should use a server-side Google credential in Vercel, preferably a service account or purpose-scoped OAuth credential with least privilege, before production pages directly query Drive/Calendar.
- **Slack booking alerts**: Website can support `SLACK_WEBHOOK_URL` / `SLACK_BOT_TOKEN`, but production currently needs the exact approved channel and webhook/token before sending alerts.
- **Metricool**: Social dashboard expects Metricool credentials if live metrics/publishing are required.
- **Printful**: Merch fulfillment needs `PRINTFUL_API_KEY` / `PRINTFUL_STORE_ID` and checkout/payment decision before implementation.

## Guardrails

- Drive/Calendar: read-only inventory and hold-link workflows are safe by default. Automatic calendar writes require approval of exact calendar, event rules, and conflict handling.
- Stripe: read-only dashboards first; no money movement without explicit approval.
- Flo: keep Flo scoped to approved Juke's business knowledge, Slack/social/booking operations, and the Kanban dashboard. Do not expose broad Hermes memory.
- Public assets: do not publish guest-visible footage, licensed music, pricing/offers, or face-heavy media without human approval.
