# Obsidian → Kanban → Agent Flow

## Overview

The jukes-librarian enriches triage cards by searching the Obsidian vault at `/Users/lexi/Documents/obsidian-vault` before routing tasks to specialist agents. This document shows how to search/reference Obsidian safely, what gets copied into Kanban, and how John can trace the flow.

## Obsidian vault structure

```
/Users/lexi/Documents/obsidian-vault/
├── projects/           # Active ventures (Juke's Diner.md, LKQ Data Project.md, etc.)
├── people/             # Team/contact profiles (Daniel.md, Justin.md, Keith.md, etc.)
├── systems/            # Operating systems (Jukes Agent Operating System.md)
├── reference/          # Core knowledge (Master Memory.md, Onboarding Notes.md)
├── instructions/       # Agent/system instructions (AGENTS.md, SOUL.md, USER.md)
├── daily/              # Daily notes and onboarding logs
├── agents/             # Agent architecture and context docs
└── tools/              # Tool/system references
```

## Triage enrichment workflow

When a triage card arrives (from John's Telegram, Flo signal, email, or dashboard input):

1. **jukes-librarian reads triage card** — title + body from Kanban.
2. **Search Obsidian for context** — use `search_files` with keywords from the card.
3. **Read relevant notes** — pull in context from matching `.md` files.
4. **Enrich card with wikilinks** — add `[[Juke's Diner]]`, `[[Daniel]]`, `[[Toast]]` etc. when relevant.
5. **Route to specialist** — update assignee based on enriched context.
6. **Comment on card** — document what Obsidian context was used.

## Safe search patterns

### Content search (keyword in notes)
```bash
# Find all mentions of "Toast" in vault
search_files(
  pattern="Toast",
  target="content",
  path="/Users/lexi/Documents/obsidian-vault",
  file_glob="*.md"
)
```

### File search (find note by name)
```bash
# Find "Juke's Diner.md"
search_files(
  pattern="Juke*",
  target="files",
  path="/Users/lexi/Documents/obsidian-vault"
)
```

### Multi-keyword OR search
```bash
# Find notes mentioning any of: event truck, Daniel, bookings
search_files(
  pattern="event truck|Daniel|booking",
  target="content",
  path="/Users/lexi/Documents/obsidian-vault",
  file_glob="*.md"
)
```

## What to copy into Kanban

### ✅ Safe to copy
- Wikilinks: `[[Juke's Diner]]`, `[[Daniel]]`, `[[Toast]]`
- Public facts: location names, team roles, vendor names
- Context summaries: "Daniel operates event truck (currently cash negative)"
- Priorities from vault: "3rd location must be profitable or shut down"

### ❌ Never copy
- Passwords, API keys, credentials
- PII: addresses, phone numbers, SSNs, financial account numbers
- Raw Slack/email conversations that contain sensitive details
- Dashboard login credentials (even if they appear in vault notes)

## Obsidian wikilink conventions

When enriching cards, use wikilinks to help agents find full context:

- `[[Juke's Diner]]` — main project note
- `[[Daniel]]`, `[[Justin]]`, `[[Keith]]` — team member profiles
- `[[Toast]]` — POS system
- `[[Sysco]]` — distributor
- `[[Jukes Agent Operating System]]` — agent routing/roster
- `[[Master Memory]]` — core knowledge base

Agents can resolve wikilinks by searching vault for matching filenames.

## Example triage enrichment

**Before (from John):**
```
Title: Event truck losing money
Body: Daniel says event truck is cash negative. Need to figure out if we keep it or shut it down.
```

**After (enriched by librarian):**
```
Title: Event truck profitability decision
Body: [[Daniel]] operates the event truck (one of 3 Juke's Diner locations). Currently cash negative. 

Context from [[Juke's Diner]]:
- Event truck must be profitable or shut down (stated priority)
- Other locations: Trailer Park (Justin, 7% of sales), Location 3 (24ft trailer, delayed)

Decision needed: keep event truck if path to profitability is clear, otherwise shut down and redeploy resources.

Assignee: jukes-finance-agent (needs P&L analysis)
Wikilinks: [[Juke's Diner]] [[Daniel]] [[Toast]]
```

## Dashboard visibility

John can see the Obsidian → Kanban → Agent flow in two places:

1. **Kanban dashboard** — enriched card body shows wikilinks + context
2. **Kanban comments** — librarian documents which Obsidian notes were consulted

## Guardrails

- **No secrets in Kanban**: Kanban rows are durable forever; never paste credentials/keys/passwords.
- **Treat wikilinks as references**: Don't copy entire Obsidian notes into Kanban; link to them instead.
- **Agent access to vault**: All agents can read Obsidian vault via `search_files` + `read_file` when needed.
- **Vault writes are rare**: Only librarian/research agents should create/update Obsidian notes; specialist agents work in their task workspaces.

## Related docs

- `/Users/lexi/Documents/obsidian-vault/systems/Jukes Agent Operating System.md` — full agent roster
- `/Users/lexi/Documents/obsidian-vault/projects/Juke's Diner.md` — core business context
- `/Users/lexi/Documents/obsidian-vault/reference/Master Memory.md` — system-wide memory
