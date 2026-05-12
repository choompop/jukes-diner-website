# Skill Creation Guidelines — When and How Agents Should Create Skills

## Purpose
Define when agents should create new skills, what makes a good skill, and the process for creating and maintaining them.

---

## When to create a new skill

### Strong signals (create immediately):
1. **Complex task succeeded after 5+ tool calls** with non-obvious workflow
2. **Error overcome** through iterative debugging with reusable solution
3. **User-corrected approach** that worked and should be remembered
4. **Non-trivial workflow discovered** that will recur
5. **User explicitly asks** "remember this" or "save this as a skill"

### Weak signals (probably don't create):
- One-time tasks unlikely to recur
- Simple workflows (1-2 tool calls)
- Tasks already covered by existing skills
- Exploratory work without clear outcome
- Failed attempts or abandoned approaches

### Before creating, ask:
1. Does this solve a recurring problem?
2. Is the workflow non-obvious enough to forget?
3. Would another agent benefit from this?
4. Is this better as a skill vs. a note vs. documentation?
5. Can I merge this into an existing skill instead?

---

## What makes a good skill

### Structure
```yaml
---
name: skill-name-here
description: One-line summary (< 80 chars)
version: 1.0.0
metadata:
  hermes:
    tags: [tag1, tag2, tag3]
    related_skills: [other-skill]
---

# Skill Title

> Brief context: what problem this solves, when to load it.

## When to use
- Trigger condition 1
- Trigger condition 2
- NOT for [anti-pattern]

## Prerequisites
- Tool/CLI installed: `tool-name`
- Environment variable: `$ENV_VAR`
- Account/auth: service-name API key

## Workflow

### 1. First step
Exact command or tool call:
```bash
command --flag value
```

Expected output: [describe]
If it fails: [troubleshooting]

### 2. Second step
[Continue numbered steps...]

## Pitfalls
- **Common error:** How to fix it
- **Edge case:** How to handle it
- **Performance:** What to watch for

## Verification
How to confirm the workflow succeeded:
- [ ] Check 1
- [ ] Check 2

## Examples
Real-world usage examples with context.

[Skill directory: path/to/skill]
```

### Good practices
- **Start with "When to use"** — helps agents decide if skill is relevant
- **Number the steps** — makes workflows easy to follow
- **Include exact commands** — no ambiguity
- **Document pitfalls** — save future debugging time
- **Add verification steps** — know when you're done
- **Use examples** — show real usage, not hypothetical
- **Keep it focused** — one skill per workflow
- **Version it** — track major changes

### Bad practices
- Vague descriptions ("do stuff with API")
- Missing prerequisites
- Steps without commands ("then configure it")
- No error handling guidance
- No examples
- Everything-skill that does 10 unrelated things
- Duplicate content from other skills

---

## Skill creation workflow

### 1. Capture the working approach
After successfully completing a complex task:
```bash
# Ask user first
"I just completed [task] using [approach]. Should I save this as a skill for future use?"

# If yes, or if task was complex enough to warrant it:
skill_manage(
    action="create",
    name="descriptive-skill-name",
    category="appropriate-category",  # devops, research, github, productivity, etc.
    content="""---
name: descriptive-skill-name
description: One-line summary
version: 1.0.0
metadata:
  hermes:
    tags: [relevant, tags]
---

# Skill Title

[Full skill content following structure above]
"""
)
```

### 2. Choose the right category
- `devops` — Kanban, cron, deployment, monitoring
- `github` — Git, PRs, issues, code review
- `research` — Academic papers, competitor analysis, market research
- `productivity` — Documents, spreadsheets, email, calendar
- `media` — Video, audio, images, content creation
- `creative` — Design, writing, branding
- `software-development` — Coding workflows, debugging, testing
- Custom category for domain-specific skills

### 3. Add supporting files if needed
```bash
# For scripts
skill_manage(
    action="write_file",
    name="skill-name",
    file_path="scripts/helper.py",
    file_content="#!/usr/bin/env python3\n# Helper script\n..."
)

# For templates
skill_manage(
    action="write_file",
    name="skill-name",
    file_path="templates/config.yaml",
    file_content="# Template configuration\n..."
)

# For reference docs
skill_manage(
    action="write_file",
    name="skill-name",
    file_path="references/api-docs.md",
    file_content="# API Documentation\n..."
)
```

### 4. Test the skill immediately
```bash
# View the skill
skill_view(name="skill-name")

# Load it in context and try using it
# Verify instructions are clear and complete
```

### 5. Update agent GOALS.md
```bash
# Add skill to relevant agent's goals
echo "- \`skill-name\` — one-line description" >> ~/.hermes/profiles/agent-name/GOALS.md
```

---

## Skill naming conventions

### Good names (lowercase, hyphens, descriptive)
- `franchise-metrics-dashboard`
- `stripe-read-only-health-check`
- `catering-intake-workflow`
- `weekly-cashflow-analysis`
- `github-security-scan`

### Bad names (too generic, unclear, or verbose)
- `utils` (what utils?)
- `helper` (helps with what?)
- `skill1` (meaningless)
- `the-complete-guide-to-everything-related-to-franchise-operations` (too long)

### Categories in name (optional, use when helpful)
- `finance-cashflow-analysis` (finance category implied)
- `ops-deployment-checklist` (ops category implied)
- `research-competitor-monitoring` (research category implied)

---

## When to update existing skills

### Update triggers:
1. **Instructions become stale** — APIs changed, tools updated
2. **Missing steps found** — during use, discovered gaps
3. **Pitfalls encountered** — hit an error not documented
4. **Better approach discovered** — found more efficient workflow
5. **Security issue found** — hardcoded secret, unsafe command
6. **OS-specific failure** — works on Mac but not Linux

### Update workflow:
```bash
# Read current skill
skill_view(name="skill-name")

# Patch specific section (preferred for small changes)
skill_manage(
    action="patch",
    name="skill-name",
    old_string="old text to find",
    new_string="new text to replace with"
)

# OR full rewrite (for major overhauls)
skill_manage(
    action="edit",
    name="skill-name",
    content="[complete updated SKILL.md]"
)
```

### Update immediately when:
- You use a skill and hit an issue not covered by it
- An API/tool version changes breaking the workflow
- A security vulnerability is discovered
- User corrects the approach

**Don't wait** — outdated skills become liabilities.

---

## When to consolidate or split skills

### Consolidate when:
- Multiple skills cover overlapping workflows
- Skill has become too granular (< 50 lines, single step)
- Better categorization emerges (3 Stripe skills → 1 unified)
- Workflows are always used together

### Consolidation workflow:
```bash
# 1. Create the umbrella skill with combined content
skill_manage(action="create", name="unified-skill", ...)

# 2. Delete old skills, declaring absorption
skill_manage(action="delete", name="old-skill-1", absorbed_into="unified-skill")
skill_manage(action="delete", name="old-skill-2", absorbed_into="unified-skill")

# 3. Update GOALS.md to reference new skill
```

### Split when:
- Skill has grown too large (> 500 lines)
- Covers multiple unrelated workflows
- Some parts used frequently, others rarely
- Different agents need different parts

### Split workflow:
```bash
# 1. Create new focused skills from sections
skill_manage(action="create", name="focused-skill-1", ...)
skill_manage(action="create", name="focused-skill-2", ...)

# 2. Delete bloated skill, declaring split
skill_manage(action="delete", name="bloated-skill", absorbed_into="")  # empty = pruned

# 3. Update GOALS.md to reference new skills
```

---

## When to remove skills

### Remove when:
- Skill hasn't been loaded in 90+ days
- Workflow is obsolete (tool deprecated, process changed)
- Better alternative exists (bundled skill added, better community skill)
- Security risk that can't be fixed
- Maintenance burden exceeds value

### Removal workflow:
```bash
# Check last usage
skill_view(name="skill-name")
# Review version history, last modified date

# Remove if truly unused
skill_manage(
    action="delete",
    name="skill-name",
    absorbed_into=""  # empty string = pruned, no replacement
)

# Update GOALS.md
# Remove line: `- skill-name — ...`

# Document removal reason in agent notes
# "Removed skill-name on 2026-05-08: obsolete after switching to bundled xyz skill"
```

---

## Skill quality checklist

Before marking a skill as complete, verify:

- [ ] **Name** is descriptive, lowercase, hyphenated
- [ ] **Description** is one line, < 80 characters
- [ ] **Version** is set (start at 1.0.0)
- [ ] **Tags** are relevant and accurate
- [ ] **"When to use"** section is clear
- [ ] **Prerequisites** are documented
- [ ] **Workflow steps** are numbered and explicit
- [ ] **Commands** are exact and copy-pasteable
- [ ] **Pitfalls** section exists with common errors
- [ ] **Verification** steps confirm success
- [ ] **Examples** show real usage
- [ ] **No secrets** in skill content
- [ ] **Supporting files** are in correct subdirectories
- [ ] **Tested** immediately after creation
- [ ] **GOALS.md updated** for relevant agent(s)

---

## Agent-specific guidelines

### jukes-research-agent
Create skills for:
- Recurring research workflows (competitor monitoring, market analysis)
- Data collection/parsing patterns
- Vendor/tool evaluation frameworks
- SEO/content analysis procedures

### jukes-coding-agent
Create skills for:
- Dashboard-specific patterns (component structure, testing approach)
- Migration procedures (JSON → SQLite, local → Supabase)
- Build/deploy workflows
- Code review checklists

### jukes-finance-agent
Create skills for:
- Cashflow analysis procedures
- Bookkeeping checklists
- Multi-entity accounting patterns
- Receipt/document processing workflows

### jukes-ops-agent
Create skills for:
- Deployment procedures
- Health check/monitoring patterns
- Cron job management
- Integration testing workflows

### jukes-email-agent
Create skills for:
- Email classification patterns
- Action item extraction
- Prompt injection defense
- Calendar/booking parsing

### jukes-editor
Create skills for:
- Brand voice checking procedures
- Content repurposing workflows
- Copy editing checklists
- Tone calibration examples

### jukes-qa-agent
Create skills for:
- Testing checklists (mobile, accessibility, performance)
- Bug reporting templates
- Regression testing procedures
- Visual QA standards

### jukes-librarian
Create skills for:
- Card triage patterns
- Routing decision frameworks
- Context enrichment procedures
- Decomposition playbooks

---

## Common anti-patterns

### Anti-pattern: "God skill"
Creating one massive skill that does everything.

**Fix:** Split into focused skills, one per workflow.

### Anti-pattern: "README skill"
Skill is just generic documentation, not a workflow.

**Fix:** Convert to reference file or delete. Skills are for procedures, not docs.

### Anti-pattern: "Unstable skill"
Skill works sometimes but fails unpredictably.

**Fix:** Debug until reliable or remove. Unreliable skills are worse than no skill.

### Anti-pattern: "Secret skill"
Skill contains API keys, tokens, credentials.

**Fix:** Use environment variables, remove hardcoded secrets.

### Anti-pattern: "One-shot skill"
Created for a task that will never happen again.

**Fix:** Delete or convert to project-specific note.

### Anti-pattern: "Duplicate skill"
Recreates functionality of bundled or existing skill.

**Fix:** Use existing skill instead, delete duplicate.

---

## Skill lifecycle

```
┌─────────────┐
│   Problem   │ → Recurring complex task identified
└──────┬──────┘
       ↓
┌─────────────┐
│   Capture   │ → Document working approach after success
└──────┬──────┘
       ↓
┌─────────────┐
│   Create    │ → skill_manage(action="create")
└──────┬──────┘
       ↓
┌─────────────┐
│    Test     │ → skill_view → use immediately
└──────┬──────┘
       ↓
┌─────────────┐
│  Use/Learn  │ → Apply skill, discover gaps/pitfalls
└──────┬──────┘
       ↓
┌─────────────┐
│   Update    │ → skill_manage(action="patch")
└──────┬──────┘
       ↓
┌─────────────┐
│  Stabilize  │ → Skill becomes reliable reference
└──────┬──────┘
       ↓
  ┌────┴────┐
  ↓         ↓
┌─────┐  ┌──────┐
│Merge│  │Retire│ → Consolidate or remove when appropriate
└─────┘  └──────┘
```

---

## Examples

### Good skill creation (after complex task)

**Context:** Successfully set up automated franchise KPI tracking after 8 tool calls involving Airtable, Google Sheets, and custom Python script.

**Action:**
```python
skill_manage(
    action="create",
    name="franchise-kpi-tracking",
    category="productivity",
    content="""---
name: franchise-kpi-tracking
description: Automated franchise KPI tracking via Airtable + Sheets
version: 1.0.0
metadata:
  hermes:
    tags: [franchise, kpi, airtable, sheets, automation]
    related_skills: [airtable, google-workspace]
---

# Franchise KPI Tracking

> Automate weekly KPI collection from multiple sources into centralized dashboard.

## When to use
- Weekly KPI refresh for franchise operations
- New franchise location added (need to add to tracking)
- KPI definitions change

## Prerequisites
- Airtable API key: `$AIRTABLE_API_KEY`
- Google Sheets access via `gws` CLI
- Python 3.8+ with pandas, requests

## Workflow

### 1. Extract KPIs from Airtable
```bash
# Get latest records from Franchise Operations base
curl -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/appXXX/Locations?view=KPI%20View" \
  > /tmp/franchise_kpis.json
```

Expected: JSON with 10-50 records (one per location)
If fails: Check API key, view name, base ID

### 2. Transform data
```bash
python3 scripts/transform_kpis.py /tmp/franchise_kpis.json > /tmp/kpis.csv
```

Expected: CSV with columns: location, revenue, cogs, labor_cost, net_margin
If fails: Check script exists, JSON schema matches

### 3. Upload to Google Sheets
```bash
gws sheets update "Franchise Dashboard" \
  --range "KPIs!A2:E100" \
  --csv /tmp/kpis.csv
```

Expected: "Updated 47 rows"
If fails: Check sheet name, ensure auth is valid

## Pitfalls
- **Airtable rate limits:** Max 5 requests/second, add delays if looping
- **Schema changes:** If Airtable fields renamed, update transform script
- **Sheet range:** Hardcoded A2:E100, expand if more than 100 locations

## Verification
- [ ] `/tmp/kpis.csv` exists and has expected rows
- [ ] Google Sheet shows updated timestamp
- [ ] Spot-check 3 locations for accuracy

## Examples

Weekly refresh:
```bash
# Run full pipeline
./scripts/refresh_franchise_kpis.sh
```

Add new location:
```bash
# Airtable auto-includes new records in view
# Just run weekly refresh
```
"""
)

# Add supporting script
skill_manage(
    action="write_file",
    name="franchise-kpi-tracking",
    file_path="scripts/transform_kpis.py",
    file_content="""#!/usr/bin/env python3
import json, csv, sys

with open(sys.argv[1]) as f:
    data = json.load(f)

writer = csv.DictWriter(sys.stdout, fieldnames=['location','revenue','cogs','labor_cost','net_margin'])
writer.writeheader()

for record in data['records']:
    fields = record['fields']
    writer.writerow({
        'location': fields['Location Name'],
        'revenue': fields['Revenue'],
        'cogs': fields['COGS'],
        'labor_cost': fields['Labor Cost'],
        'net_margin': fields['Net Margin']
    })
"""
)
```

**Result:** Reusable skill for weekly workflow, clear steps, includes script.

---

### Bad skill creation (premature)

**Context:** Used `web_search` once to find competitor pricing.

**Action:**
```python
# DON'T DO THIS — one-time task, not a recurring workflow
skill_manage(
    action="create",
    name="competitor-research",
    content="""Search for competitors and look at their prices."""
)
```

**Why bad:**
- Too generic
- Not a workflow (just "search")
- One-time task
- No value over just using web_search

**Better action:** Don't create a skill. If this becomes recurring with specific sources/analysis, then create one.

---

Last updated: 2026-05-08
