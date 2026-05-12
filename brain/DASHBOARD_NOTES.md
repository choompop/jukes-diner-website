# Dashboard Notes Integration

## Overview

This dashboard now connects to the Obsidian vault knowledge base through the Kanban workflow. When you create tasks, the librarian enriches them with relevant context before routing to specialists.

## How to see it working

### 1. Create a task

Via any channel:
- **Telegram**: Message Hermes Main Delegator
- **Dashboard**: Use the brain dump chat
- **Flo**: Team signals from Slack
- **Email**: Detected action items

### 2. Watch the enrichment

The task lands in Kanban triage. Within the next 10-minute dispatcher cycle:

1. `jukes-librarian` reads the task
2. Searches Obsidian vault for context
3. Adds [[wikilinks]] and context summary
4. Routes to the right specialist
5. Adds a comment documenting the enrichment

### 3. Track execution

Specialist agents work in isolated workspaces and report:
- **Completion**: What was built/changed
- **Blocker**: What decision is needed
- **Progress**: Heartbeats for long operations

### 4. Review outcomes

Check the Kanban dashboard to see:
- Enriched task bodies with wikilinks
- Librarian comments showing vault sources
- Specialist completion summaries
- Audit trail of all events

## Example flow

**Your message:**
> "event truck is losing money, need to decide if we keep it"

**Triage card created:**
```yaml
Title: event truck issue
Body: losing money, need decision
Status: triage
```

**Librarian enriches (within 10 min):**
```yaml
Title: Event truck profitability decision
Body: |
  [[Daniel]] operates the event truck (1 of 3 Juke's Diner locations).
  Currently cash negative.
  
  Context from [[Juke's Diner]]:
  - Priority: "Event truck must be profitable or shut down"
  - Other locations: Trailer Park (Justin, 7%), Location 3 (delayed)
  
  Decision: P&L analysis needed to determine path to profitability.

Status: ready
Assignee: jukes-finance-agent
```

**Librarian adds comment:**
> Enriched from [[Juke's Diner]] vault note. Event truck is 1/3 locations, cash negative per stated priorities. Routed to finance agent for P&L analysis.

**Finance agent executes:**
- Pulls Toast data for event truck location
- Analyzes revenue, COGS, labor costs
- Compares to other locations
- Prepares decision brief

**Finance agent completes:**
```yaml
Summary: Event truck P&L shows 18% gross margin vs 32% for Trailer Park.
         Need 40% sales increase to break even. Recommend shutdown and
         redeploy to Location 3 build-out.

Metadata:
  revenue_trailing_30d: 12400
  cogs_pct: 42
  labor_pct: 40
  breakeven_revenue: 17360
  recommendation: shutdown
```

## Wikilink conventions

When you see these in enriched cards, they reference vault notes:

- `[[Juke's Diner]]` → Main business overview
- `[[Daniel]]` → Regional Manager profile
- `[[Toast]]` → POS system notes
- `[[Sysco]]` → Distributor notes
- `[[Jukes Agent Operating System]]` → Full agent roster

## Vault structure

```
/Users/lexi/Documents/obsidian-vault/
├── projects/           # Juke's Diner, Policy Horizon, LKQ, etc.
├── people/             # Daniel, Justin, Keith, Bo
├── systems/            # Agent operating system, integrations
├── reference/          # Master Memory, onboarding
├── instructions/       # Agent behavior docs
└── daily/              # Historical logs
```

## Security

- **No secrets in Kanban**: Credentials never copied from vault to tasks
- **Vault is read-mostly**: Enrichment reads context; specialists work in task workspaces
- **Audit trail**: All enrichments documented in Kanban comments

## Technical docs

- **Integration guide**: `/brain/OBSIDIAN_KANBAN_INTEGRATION.md` (this repo)
- **Vault integration doc**: Obsidian vault → `systems/Obsidian Kanban Integration.md`
- **Librarian workflow**: Hermes skill `jukes-triage-enrichment`
- **Test suite**: `/tests/obsidian-integration.test.mjs`

## Agent roster

Once enriched, tasks route to these specialists:

| Profile | Handles |
|---|---|
| `jukes-coding-agent` | Dashboard features, APIs |
| `jukes-editor` | Content, copy, brand |
| `jukes-finance-agent` | P&L, cash flow, bookkeeping |
| `jukes-ops-agent` | Deployment, infra, cron |
| `jukes-research-agent` | Vendor research, competitive intel |
| `jukes-qa-agent` | Testing, mobile, regressions |
| `jukes-email-agent` | Email triage, loop detection |
| Flo (`jukes-social-agent`) | Slack, social, team comm |

## Related

- Kanban dashboard: Hermes Agent Dashboard
- Obsidian vault: `/Users/lexi/Documents/obsidian-vault`
- Project workspace: This repo (`/Users/lexi/projects/jukes-diner-website`)
