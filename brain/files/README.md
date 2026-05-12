# Juke's Brain — Files Index

Knowledge base for Juke's Diner operating system and specialist agent workflows.

---

## Agent System Documentation

### Skill-Building Workflow (NEW — 2026-05-08)
Complete workflow for how agents discover, install, create, and maintain skills.

**Start here:** [skill-building-workflow.md](skill-building-workflow.md)

**Supporting docs:**
- [agent-skill-recommendations.md](agent-skill-recommendations.md) — Per-agent recommended skills
- [github-skill-inspection.md](github-skill-inspection.md) — Safe GitHub skill installation
- [skill-creation-guidelines.md](skill-creation-guidelines.md) — When/how to create skills
- [skill-acquisition-card-template.md](skill-acquisition-card-template.md) — Kanban card templates

### Agent Roster
- [AGENT_ROSTER_FEATURE.md](AGENT_ROSTER_FEATURE.md) — Specialist agent roles and features

---

## Operations

### Finance & Bookkeeping
- [financial-kpi-dictionary.md](financial-kpi-dictionary.md) — Financial metrics definitions
- [weekly-finance-rhythm.md](weekly-finance-rhythm.md) — Weekly bookkeeping workflow
- [document-retention-checklist.md](document-retention-checklist.md) — What to keep, how long

### Operations & SOPs
- [operator-sop-hub.md](../docs/operator-sop-hub.md) — **Operator SOP Hub** (inventory, staffing, payroll, training)
- [ops-sops.md](ops-sops.md) — Standard operating procedures
- [team-roles.md](team-roles.md) — Team member roles and responsibilities
- [vendor-roster.md](vendor-roster.md) — Vendor contacts and details

### Marketing & Content
- [brand-foundation.md](brand-foundation.md) — Complete brand foundation (voice, visual design, typography, asset guidelines)
- [brand-voice.md](brand-voice.md) — Quick brand voice reference (subset of foundation)
- [content-calendar.md](content-calendar.md) — Content planning and schedule
- [content-pipeline-dashboard-requirements.md](content-pipeline-dashboard-requirements.md) — Dashboard requirements for content workflow (idea → approval → Metricool)
- [offer-library.md](offer-library.md) — Standard offers and promotions
- [performance-notes.md](performance-notes.md) — Content performance tracking

### Sales & Catering
- [catering-intake.md](catering-intake.md) — Catering inquiry workflow

---

## Quick Navigation by Role

### For Agents
| Agent | Primary Docs |
|-------|--------------|
| jukes-research-agent | skill-building-workflow, agent-skill-recommendations |
| jukes-coding-agent | agent-skill-recommendations (coding section) |
| jukes-finance-agent | financial-kpi-dictionary, weekly-finance-rhythm, document-retention-checklist |
| jukes-ops-agent | ops-sops, agent-skill-recommendations (ops section) |
| jukes-email-agent | catering-intake, team-roles |
| jukes-editor | brand-voice, content-calendar, content-pipeline-dashboard-requirements, offer-library |
| jukes-qa-agent | agent-skill-recommendations (QA section) |
| jukes-librarian | skill-building-workflow, AGENT_ROSTER_FEATURE |

### For John
| Task | Doc |
|------|-----|
| Understand agent skills | skill-building-workflow.md |
| Check agent roles | AGENT_ROSTER_FEATURE.md |
| Review finance workflows | weekly-finance-rhythm.md |
| Check brand standards | brand-foundation.md |
| Review SOPs | ops-sops.md |

---

## Document Types

### 📘 Reference (evergreen knowledge)
- Brand voice, team roles, vendor roster, KPI dictionary

### 🔄 Workflows (recurring processes)
- Weekly finance rhythm, catering intake, skill-building workflow

### 📋 Checklists (verification steps)
- Document retention, ops SOPs

### 📅 Planning (schedules and calendars)
- Content calendar, offer library

### 🤖 Agent System (how agents work)
- Skill-building workflow, agent roster, skill recommendations

---

## Contributing

### Adding new docs
1. Create markdown file in this directory
2. Use clear, descriptive filename (kebab-case)
3. Start with YAML frontmatter if needed
4. Add to this README in appropriate section
5. Link from relevant agent GOALS.md if applicable

### Updating existing docs
1. Add "Last updated: YYYY-MM-DD" at bottom
2. Note major changes in doc itself
3. Update version if using semantic versioning
4. Notify relevant agents via Kanban if breaking change

---

## Maintenance

**Weekly:** Review triage docs (catering-intake, ops-sops)  
**Monthly:** Update planning docs (content-calendar, offer-library)  
**Quarterly:** Audit reference docs for staleness  
**As-needed:** Agent system docs when workflows change

---

Last updated: 2026-05-08
