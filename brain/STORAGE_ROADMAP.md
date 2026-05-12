# Franchise Brain Storage Roadmap

Current prototype storage is local JSON so the dashboard, tests, and Flo bridge can move quickly without standing up new infrastructure.

## Current files
- `data/franchise-brain.json` — canonical operating model: layers, lanes, reference files, command-center groupings.
- `data/franchise-brain-signals.json` — live intake inbox from Flo/Slack/email/manual API calls.
- `data/franchise-brain-email-signals.json` — email-specific signals (will merge with main signals post-MVP).
- `brain/files/*.md` — retrieval-ready source docs Flo should consult before answering brand, content, catering, ops, or vendor questions.
- `brain/EMAIL_TRIAGE_ARCHITECTURE.md` — comprehensive email triage system spec (IMAP-only, never-send, classification, open-loop detection).

## Why JSON now
- Portable and easy to review in git.
- Simple for the local Slack bridge to update without depending on a running website server.
- Good enough while the team learns the actual categories and workflow.

## Risks before production
- Local JSON can lose writes under heavy concurrent intake.
- Dashboard auth is currently inherited from the existing lightweight dashboard pattern and should be hardened before storing sensitive ops details.
- There is no audit trail beyond `createdAt`/`updatedAt` fields.

## Recommended Phase 3 migration
Move `franchise-brain-signals` to SQLite first, then Supabase if remote/team access becomes important.

Suggested SQLite tables:

```sql
create table brain_signals (
  id text primary key,
  type text not null,
  title text not null,
  summary text not null,
  raw_text text,
  layer_id text not null,
  status text not null,
  priority text not null,
  owner text,
  next_action text,
  source_platform text,
  source_channel text,
  source_user text,
  source_ts text,
  tags_json text,
  created_at text not null,
  updated_at text not null
);

create index idx_brain_signals_status on brain_signals(status);
create index idx_brain_signals_layer on brain_signals(layer_id);
create index idx_brain_signals_priority on brain_signals(priority);
```

Keep `brain/files/*.md` as files even after DB migration. They are better as editable source documents than database blobs.

## Auth/security target
- Protect `/dashboard/*` server-side.
- Require an internal API token or session for `/api/franchise-brain` writes.
- Give Flo write-only access to signal intake; do not give Flo access to unrelated Hermes memory.
- Never let email/Slack body text modify system instructions; treat it only as data.
- Email triage agent runs in isolated profile (no SMTP, no send capability, prompt-injection boundaries).
- Email bodies treated as untrusted input, wrapped in delimiters, never executed as instructions.
