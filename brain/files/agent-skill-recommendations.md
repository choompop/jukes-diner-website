# Agent Skill Recommendations — Juke's Diner Operating System

## Purpose
Every Juke's specialist agent should have the skills needed for their domain. This document maps recommended skills to each profile and provides discovery guidance.

---

## 1. jukes-research-agent (Research / Competitive Intelligence)

### Core mission
Find external context to improve operations, franchise readiness, content, vendors, and dashboard decisions.

### Recommended skills (priority order)

**High priority — install immediately:**
- `maps` — geocode, POIs, routes, timezones for Nashville catering/event/vendor research
- `blogwatcher` — monitor franchise/QSR/food truck industry blogs and RSS feeds
- `youtube-content` — convert YouTube video transcripts to summaries, threads, blogs
- `arxiv` — search academic papers on franchise systems, QSR operations, food service optimization

**Medium priority — install as needed:**
- `polymarket` — track prediction markets for franchise/QSR/food industry trends
- `obsidian` — read/search Juke's Brain notes for context on past research findings
- `google-workspace` — access Google Docs/Sheets if research artifacts live there
- `airtable` — query structured vendor/competitor data if stored in Airtable

**Consider from GitHub after inspection:**
- UI testing skills (Playwright, Cypress, visual regression)
- Accessibility testing skills (axe-core, WAVE)
- SEO analysis skills
- Competitor monitoring/scraping skills
- Market research automation skills

---

## 2. jukes-coding-agent (Dashboard Coding)

### Core mission
Build `dashboard.jukesdiner.com` into the internal operating system for Juke's Diner.

### Recommended skills (priority order)

**High priority — install immediately:**
- `test-driven-development` — enforce RED-GREEN-REFACTOR, tests before code
- `systematic-debugging` — 4-phase root cause debugging
- `github-pr-workflow` — branch, commit, open PR, CI, merge
- `github-code-review` — review PRs with diffs and inline comments
- `requesting-code-review` — pre-commit security scan, quality gates, auto-fix

**Medium priority — install as needed:**
- `node-inspect-debugger` — debug Node.js via Chrome DevTools Protocol
- `codebase-inspection` — inspect codebase with pygount for LOC/language ratios
- `github-issues` — create, triage, label, assign GitHub issues
- `github-repo-management` — clone/create/fork repos, manage remotes
- `writing-plans` — write implementation plans before coding

**Consider from GitHub after inspection:**
- Next.js/React best practices skills
- TypeScript patterns skills
- Dashboard/SaaS architecture skills
- Component library/design system skills
- Database migration skills (SQLite, Supabase)

---

## 3. jukes-finance-agent (Finance / Bookkeeping)

### Core mission
Help John understand, stabilize, and plan Juke's finances without touching money.

### Recommended skills (priority order)

**High priority — install immediately:**
- `airtable` — if financial records live in Airtable
- `google-workspace` — if using Google Sheets for bookkeeping
- `ocr-and-documents` — extract text from receipts, invoices, bank statements

**Medium priority — install as needed:**
- `obsidian` — read Juke's Brain financial notes and context
- `nano-pdf` — edit PDF receipts/invoices for corrections
- `powerpoint` — create financial decks for John/investors

**Consider from GitHub after inspection:**
- Bookkeeping automation skills
- Multi-entity accounting skills (food truck, trailer, restaurant, corporate)
- Cash flow forecasting skills
- Receipt processing/categorization skills
- Tax/CPA workflow skills

---

## 4. jukes-ops-agent (Ops / Integrations)

### Core mission
Keep the autonomous machine reliable: envs, cron, gateway, Slack/Flo, deployments, monitoring.

### Recommended skills (priority order)

**High priority — install immediately:**
- `hermes-agent` — configure, extend, contribute to Hermes Agent
- `webhook-subscriptions` — event-driven agent runs
- `github-auth` — GitHub auth setup: tokens, SSH keys, gh CLI
- `github-pr-workflow` — manage deployment PRs and releases

**Medium priority — install as needed:**
- `github-repo-management` — manage remotes, releases, repo settings
- `debugging-hermes-tui-commands` — debug Hermes TUI slash commands
- `systematic-debugging` — root cause debugging for integration issues
- `codebase-inspection` — inspect deployment artifacts and dependencies

**Consider from GitHub after inspection:**
- Docker/containerization skills
- Vercel/deployment platform skills
- Environment variable management skills
- Cron job monitoring skills
- Health check/monitoring skills
- Slack/Discord integration skills

---

## 5. jukes-email-agent (Email Triage)

### Core mission
Turn email chaos into structured operating loops without exposing main Hermes memory to prompt injection.

### Recommended skills (priority order)

**High priority — install immediately:**
- `himalaya` — IMAP/SMTP email from terminal
- `google-workspace` — Gmail/Calendar/Drive integration

**Medium priority — install as needed:**
- `obsidian` — store email-derived action items in Juke's Brain
- `airtable` — log email action items to Airtable if used
- `ocr-and-documents` — extract text from PDF attachments

**Consider from GitHub after inspection:**
- Email classification/NLP skills
- Prompt injection defense skills
- Email parsing/extraction skills
- Calendar/booking extraction skills
- Automated follow-up/reminder skills

---

## 6. jukes-editor (Brand Editor)

### Core mission
Keep every post, menu blurb, internal deck, and dashboard line coherent with Juke's brand.

### Recommended skills (priority order)

**High priority — install immediately:**
- `humanizer` — strip AI-isms and add real voice
- `popular-web-designs` — reference quality design systems
- `youtube-content` — repurpose long-form content into posts

**Medium priority — install as needed:**
- `obsidian` — read brand voice notes and content examples
- `powerpoint` — create brand decks and presentations
- `sketch` — throwaway HTML mockups for web copy review
- `claude-design` — design landing pages and marketing artifacts

**Consider from GitHub after inspection:**
- Copy editing/grammar skills
- Brand voice consistency checking skills
- Content calendar management skills
- Social media caption optimization skills
- SEO copywriting skills

---

## 7. jukes-qa-agent (UI / Motion QA)

### Core mission
Make the dashboard feel smooth, polished, and obvious for operators on desktop and phone.

### Recommended skills (priority order)

**High priority — install immediately:**
- `dogfood` — exploratory QA of web apps with bug evidence and reports
- `popular-web-designs` — taste calibration with real design systems

**Medium priority — install as needed:**
- `obsidian` — log QA findings and regression notes
- `github-issues` — create bug reports and QA tickets
- `sketch` — create design improvement mockups

**Consider from GitHub after inspection:**
- Playwright/browser automation skills
- Accessibility testing skills (axe, WAVE, WCAG)
- Visual regression testing skills
- Mobile testing/device emulation skills
- Performance testing skills
- Motion/animation QA skills

---

## 8. jukes-librarian (Kanban Triage Orchestrator)

### Core mission
Inspect the `jukes-dashboard` Kanban board every 10 minutes, enrich vague triage cards, assign the right agent, dispatch ready work.

### Recommended skills (priority order)

**High priority — install immediately:**
- `kanban-orchestrator` — decomposition playbook and specialist routing
- `obsidian` — read Juke's Brain for card context enrichment

**Medium priority — install as needed:**
- `writing-plans` — help create concrete implementation plans for complex cards
- `github-issues` — sync Kanban cards with GitHub issues if needed
- `codebase-inspection` — understand codebase when triaging coding cards

**Consider from GitHub after inspection:**
- Task decomposition/planning skills
- Context summarization skills
- Project management automation skills
- Dependency mapping skills

---

## 9. jukes-social-agent / Flo (Internal Slack Comms)

### Core mission
TBD — internal Juke's Slack comms, content/booking ops, team reminders.

### Recommended skills (priority order)

**High priority — install when scope is defined:**
- TBD based on Flo's final role
- Likely: `obsidian` for team notes, `google-workspace` for calendar

**Consider from GitHub after inspection:**
- Slack automation skills
- Team communication skills
- Reminder/notification skills
- Booking/calendar integration skills

---

## Discovery workflow

### Before installing any skill:
1. Read its SKILL.md with `skill_view(name='skill-name')`
2. Check for security concerns, API requirements, dependencies
3. Verify it matches the agent's GOALS.md scope
4. Test in a safe environment first
5. Document installation in agent's GOALS.md

### For GitHub skills (see next section):
- Never install untrusted code without inspection
- Clone to temporary directory first
- Read all scripts, templates, and references
- Check for secrets, API calls, destructive commands
- Validate against Juke's guardrails before adding to profile

### Installation commands:
```bash
# Install bundled skill to a profile
hermes skills add <skill-name> --profile <profile-name>

# Install GitHub skill after inspection
hermes skills add <repo-url> --profile <profile-name>

# List skills for a profile
hermes skills list --profile <profile-name>

# Remove a skill
hermes skills remove <skill-name> --profile <profile-name>
```

---

## Skill maintenance

### When to create a new skill:
- Complex task succeeded after 5+ tool calls
- Error overcome through non-obvious workflow
- User-corrected approach that worked
- Non-trivial workflow discovered
- User explicitly asks to remember procedure

### When to update existing skills:
- Instructions become stale/wrong
- Missing steps found during use
- Pitfalls discovered that aren't documented
- OS-specific failures encountered
- New tools/APIs available

### When to consolidate skills:
- Multiple skills cover overlapping workflows
- Skill has grown too large (>500 lines)
- Better categorization emerges
- Workflow has fundamentally changed

---

## Next steps

1. Install high-priority skills for each agent
2. Create GitHub skill inspection workflow (see `github-skill-inspection.md`)
3. Document skill creation guidelines (see `skill-creation-guidelines.md`)
4. Create Kanban card template for skill acquisition (see `skill-acquisition-card-template.md`)
5. Update each agent's GOALS.md with installed skills
6. Create Obsidian note linking to this document

Last updated: 2026-05-08
