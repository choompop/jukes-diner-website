# Full Site + Franchise Dashboard QA — 2026-05-12

## Scope

- Public website routes
- Protected dashboard routes/tabs
- Dashboard read APIs
- Login/session flow
- Safe public booking validation flow
- Integration-linked dashboard sections: Drive, Calendar, Slack/Flo, Stripe, content index

## Result

Status: **Pass with credential-gated caveats**

- 43 HTTP/auth smoke checks passed.
- 36 browser route clickthrough checks passed after fixes.
- Public booking validation correctly rejects invalid empty submissions with HTTP 400.
- Production deploy completed and `jukesdiner.com` is aliased to the latest Vercel build.

## Routes checked

### Public

- `/`
- `/menu`
- `/book`
- `/find-us`
- `/about`
- `/order`
- `/merch`
- `/apply`
- `/privacy`
- `/terms`
- `/chat`

### Dashboard

- `/dashboard`
- `/dashboard/agents`
- `/dashboard/blocked-tasks`
- `/dashboard/bookings`
- `/dashboard/brain-dump`
- `/dashboard/chat`
- `/dashboard/command-center`
- `/dashboard/daniel-operator-tracker`
- `/dashboard/drive-viewer`
- `/dashboard/financials`
- `/dashboard/franchise-brain`
- `/dashboard/hermes-kanban`
- `/dashboard/history`
- `/dashboard/interactive-test`
- `/dashboard/marketing`
- `/dashboard/menu-management`
- `/dashboard/notion-pipeline`
- `/dashboard/onboarding`
- `/dashboard/operations`
- `/dashboard/outputs`
- `/dashboard/resources`
- `/dashboard/social`
- `/dashboard/support`
- `/dashboard/training-center`
- `/dashboard/workflow`

### APIs

- `/api/agents`
- `/api/agent-outputs`
- `/api/franchise-financials`
- `/api/media-hub`
- `/api/stripe-connect`
- `/api/franchise-brain`
- `/api/dumps`

## Fixes made during QA

1. **Brain Dump API 500**
   - Problem: `/dashboard/brain-dump` triggered `/api/dumps` 500 when Supabase history was unavailable/misconfigured.
   - Fix: API now degrades gracefully with an empty history response instead of breaking the page.

2. **Missing agent roster JSON**
   - Problem: `/dashboard/agents` requested `/data/agent-roster.json`, which was not published to Vercel.
   - Fix: roster generator now writes both `data/agent-roster.json` and `public/data/agent-roster.json` during build.

3. **Broken SOP shortcut links**
   - Problem: command center linked to non-existent `/dashboard/resources/sop/...` pages.
   - Fix: shortcuts now anchor into `/dashboard/resources#sop-*` instead of 404 routes.

## Remaining credential-gated caveats

These are not page-breakers, but they are not truly live until credentials are added:

- Stripe read-only financial reporting needs restricted Stripe keys and account IDs.
- Google Drive/Calendar dashboard runtime browsing needs Vercel-safe Google credentials.
- Slack booking alerts need approved webhook/channel configuration.
- Metricool needs credentials before social analytics are live.
- Supabase/OpenAI-backed brain dump/history needs final production configuration if we want persistent memory/history in the dashboard.

## Readiness assessment

- Public website: **live / usable**
- Dashboard shell/navigation: **live / usable**
- Dashboard linked materials: **live / usable as links/static registry**
- Live financial/social/calendar automation: **credential-gated**
- Franchise-dashboard readiness: **operator-demo ready, not fully production-automated until remaining credentials are connected**
