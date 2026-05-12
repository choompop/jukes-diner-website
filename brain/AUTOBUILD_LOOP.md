# Juke's Dashboard Autonomous Build Loop

This file documents the recurring autonomous build job created from John's request on 2026-05-08.

## Mission
Continuously improve the Juke's Diner dashboard into a comprehensive franchise operating system:

- Financial management and visibility
- Stripe account linking / financial account status
- Content planning and strategy
- Document and media storage
- SOP retrieval and Flo Q&A
- Internal operations and franchisee/operator workflows

## Guardrails

- Internal repo work is allowed.
- No public/external communication without explicit approval.
- No production deployment without explicit approval.
- No live Stripe charges, payouts, transfers, refunds, or account onboarding emails without explicit approval.
- Never print or commit API keys/secrets.
- Prefer tested working software over planning docs.
- Each run should keep scope small, fix bugs found by tests/QA, and avoid opening too many loops.

## Memory Alignment
The loop reads `/Users/lexi/.hermes/imports/openclaw-memory/` via `scripts/autobuild_context.py` and prioritizes:

1. Remove John from operations.
2. Protect or generate cash flow.
3. Create long-term leverage.
4. Avoid interesting but low-leverage complexity.

## Required Verification Per Run

- `npm test`
- `npm run build`
- Browser QA for changed dashboard pages when possible
- API smoke checks for changed endpoints

## Current Highest-Leverage Backlog

1. Canonical brain card management controls/API after signal conversion.
2. Email triage system implementation (see `brain/EMAIL_TRIAGE_ARCHITECTURE.md` for full spec):
   - Himalaya CLI IMAP-only setup (no SMTP, never-send guardrail)
   - Classification taxonomy and folder structure
   - Franchise Brain signal creation from email
   - Kanban task creation for high-leverage items (leads, finance, security)
   - Prompt-injection boundaries and audit logging
3. Stripe Connect account-linking architecture and dashboard status display.
4. Financial period/unit selector and obligations/documents workflow actions.
5. Document/media storage index for SOPs, brand/media, financial docs, Google Drive links.
6. Flo retrieval/Q&A against SOPs and dashboard records with approval gates.
7. Operator/franchisee QA subagent loop.
8. SQLite/Supabase migration after workflows stabilize.
