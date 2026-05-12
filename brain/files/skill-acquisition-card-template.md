# Kanban Card Template: Skill Acquisition

## Purpose
Use this template when creating Kanban cards for discovering, reviewing, installing, or creating skills for Juke's specialist agents.

---

## Template: Install Bundled Skill

**Title:** Install [skill-name] for [agent-name]

**Body:**
```
## Context
[Agent-name] needs [skill-name] to [solve what problem / enable what workflow].

## Acceptance criteria
- [ ] Skill installed to correct profile: `~/.hermes/profiles/[agent-name]`
- [ ] Skill tested and verified working
- [ ] Agent GOALS.md updated with skill reference
- [ ] Documented in Juke's Brain if domain-specific usage notes exist

## Installation steps
1. View skill: `skill_view(name='[skill-name]')`
2. Verify it matches agent scope (check GOALS.md)
3. Install: `hermes skills add [skill-name] --profile [agent-name]`
4. Test in isolation
5. Update GOALS.md: `echo "- \`[skill-name]\` — [description]" >> ~/.hermes/profiles/[agent-name]/GOALS.md`

## Verification
Load agent and confirm skill appears in available skills list.
Test basic skill functionality.

## Assignee
[agent-name or jukes-librarian for coordination]

## Priority
[Low/Medium/High based on blocker status]
```

**Example:**
```
Title: Install maps skill for jukes-research-agent

Context:
jukes-research-agent needs maps skill to geocode Nashville catering venues, find POIs for event planning, calculate routes for food truck logistics, and analyze competitor locations.

Acceptance criteria:
- [ ] Skill installed to jukes-research-agent profile
- [ ] Tested geocoding Nashville addresses
- [ ] GOALS.md updated
- [ ] Example queries documented in Juke's Brain

Installation steps:
1. skill_view(name='maps')
2. Verify matches research agent scope (location-based research)
3. hermes skills add maps --profile jukes-research-agent
4. Test: geocode "Juke's Diner, East Nashville"
5. Update GOALS.md

Verification:
Load jukes-research-agent, confirm maps skill loaded, test geocoding and POI search.

Assignee: jukes-research-agent
Priority: High (blocks vendor/venue research)
```

---

## Template: Inspect and Install GitHub Skill

**Title:** Inspect and install [repo-name] skill for [agent-name]

**Body:**
```
## Context
Found GitHub skill [repo-name] that could help [agent-name] with [workflow/problem].

Repo: [github-url]
Author: [github-username]
Stars: [count]
Last updated: [date]

## Acceptance criteria
- [ ] Skill inspected per github-skill-inspection.md workflow
- [ ] Security review passed (no secrets, no destructive commands)
- [ ] Scope validated (matches agent GOALS.md)
- [ ] Tested in isolated profile
- [ ] Installed to production profile if approved
- [ ] GOALS.md updated
- [ ] Documented in Juke's Brain with source attribution

## Inspection checklist
- [ ] Repository trust signals (stars, activity, license)
- [ ] Cloned to ~/tmp/skill-inspection
- [ ] Read SKILL.md carefully
- [ ] Inspected all scripts for security red flags
- [ ] Inspected all templates for injection risks
- [ ] Checked dependencies for vulnerabilities
- [ ] Tested in isolated test profile
- [ ] Validated against Juke's guardrails
- [ ] Decision: Install / Fix and install / Reject

## Installation steps (if approved)
1. hermes skills add ~/tmp/skill-inspection/[repo-name] --profile [agent-name]
2. Update GOALS.md
3. Test in production context
4. Document in Juke's Brain: skills/[skill-name]-notes.md
5. Clean up temp files

## Rejection criteria
- Security red flags (secrets, destructive commands, unknown network calls)
- Scope creep beyond agent role
- Overlaps with bundled skill
- Unmaintained/abandoned
- Dependencies with known vulnerabilities

## Assignee
[agent-name or jukes-ops-agent for security review]

## Priority
[Low/Medium/High based on value vs risk]
```

**Example:**
```
Title: Inspect and install playwright-testing skill for jukes-qa-agent

Context:
Found GitHub skill "hermes-playwright-testing" that could help jukes-qa-agent automate browser testing for dashboard.jukesdiner.com.

Repo: https://github.com/example/hermes-playwright-testing
Author: reputable-dev
Stars: 342
Last updated: 2026-04-15

Acceptance criteria:
[see template above]

Inspection checklist:
- [ ] Repo has 342 stars, MIT license, active commits ✓
- [ ] Cloned to ~/tmp/skill-inspection
- [ ] SKILL.md clear: "Automate browser testing with Playwright"
- [ ] Scripts reviewed: no secrets, safe file writes, no eval
- [ ] Templates safe: no injection vectors
- [ ] Dependencies: playwright@1.42.0 (latest, safe)
- [ ] Tested in test-qa-validation profile
- [ ] Matches jukes-qa-agent scope (UI/motion testing)
- [ ] Decision: Install

Installation steps:
1. hermes skills add ~/tmp/skill-inspection/hermes-playwright-testing --profile jukes-qa-agent
2. echo "- \`playwright-testing\` — Browser automation for dashboard testing" >> ~/.hermes/profiles/jukes-qa-agent/GOALS.md
3. Test on dashboard.jukesdiner.com staging
4. Document in skills/playwright-testing-notes.md
5. rm -rf ~/tmp/skill-inspection/hermes-playwright-testing

Assignee: jukes-ops-agent (security review), then jukes-qa-agent (testing)
Priority: High (unblocks automated QA)
```

---

## Template: Create New Skill

**Title:** Create [skill-name] skill for [agent-name]

**Body:**
```
## Context
[Agent-name] repeatedly performs [workflow] using [tools/approach]. This should be captured as a reusable skill.

Trigger: [What prompted this? Complex task succeeded? User request? Recurring workflow?]

## Acceptance criteria
- [ ] Skill created with clear SKILL.md
- [ ] "When to use" section defined
- [ ] Prerequisites documented
- [ ] Workflow steps numbered and explicit
- [ ] Pitfalls section with error handling
- [ ] Verification steps included
- [ ] Examples provided
- [ ] Supporting files added (scripts/templates if needed)
- [ ] Tested immediately after creation
- [ ] GOALS.md updated
- [ ] Documented in Juke's Brain

## Skill outline
Name: [skill-name]
Category: [devops/research/github/productivity/etc]
Description: [One-line description < 80 chars]
Tags: [tag1, tag2, tag3]

When to use:
- [Trigger condition 1]
- [Trigger condition 2]

Workflow:
1. [Step 1 with exact command]
2. [Step 2 with exact command]
...

Pitfalls:
- [Common error and fix]
- [Edge case and handling]

## Supporting files needed
- [ ] scripts/[script-name].py (if applicable)
- [ ] templates/[template-name].yaml (if applicable)
- [ ] references/[ref-name].md (if applicable)

## Assignee
[agent-name who will create/own the skill]

## Priority
[Low/Medium/High based on recurrence frequency and value]
```

**Example:**
```
Title: Create stripe-health-check skill for jukes-ops-agent

Context:
jukes-ops-agent repeatedly checks Stripe integration health using 6+ tool calls: verify API keys exist (without printing), test connection, check webhook endpoints, validate account status, confirm no live charges. This workflow runs weekly and should be a reusable skill.

Trigger: Ops agent completes successful Stripe health check, no issues found.

Acceptance criteria:
[see template above]

Skill outline:
Name: stripe-health-check
Category: devops
Description: Read-only Stripe health check without exposing secrets
Tags: [stripe, health-check, integration, read-only]

When to use:
- Weekly ops health check
- Before dashboard deployment
- After Stripe API key rotation
- Debugging payment integration issues

Workflow:
1. Verify STRIPE_SECRET_KEY exists: `[[ -n "$STRIPE_SECRET_KEY" ]] && echo "✓ Key exists" || echo "✗ Missing"`
2. Test connection: `curl -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/balance`
3. Check webhook endpoints: `curl -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/webhook_endpoints`
4. Validate account: `curl -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/account`
5. Verify mode: `echo $STRIPE_SECRET_KEY | grep -q "_test_" && echo "✓ Test mode" || echo "⚠ Live mode"`

Pitfalls:
- Never print STRIPE_SECRET_KEY value
- Check for test vs live mode before any operations
- Webhook endpoint count should be 1-3 (more = misconfigured)
- Balance call succeeds even with invalid permissions

Supporting files needed:
- [ ] scripts/stripe-health-check.sh (full workflow)
- [ ] templates/health-check-report.md (output template)

Assignee: jukes-ops-agent
Priority: High (weekly recurring workflow)
```

---

## Template: Update Existing Skill

**Title:** Update [skill-name] skill — [brief reason]

**Body:**
```
## Context
[Skill-name] needs updating because [reason: stale instructions / missing steps / pitfall discovered / better approach].

Discovered during: [Which task/workflow revealed the need?]

Current issue:
[Describe what's wrong/missing]

## Acceptance criteria
- [ ] Skill updated with fix
- [ ] Version bumped (1.0.0 → 1.1.0 for minor, 2.0.0 for major)
- [ ] Change tested and verified
- [ ] If supporting files changed, those updated too
- [ ] Agents using this skill notified if breaking change

## Update type
- [ ] Patch (fix typo, clarify wording, add pitfall note)
- [ ] Minor (add step, update command, improve examples)
- [ ] Major (workflow changed significantly, breaking change)

## Changes needed
**Old approach:**
[What currently says]

**New approach:**
[What it should say]

**Supporting files:**
- [ ] scripts/[file]: [change needed]
- [ ] templates/[file]: [change needed]

## Assignee
[Agent who owns/uses the skill]

## Priority
[High if blocking / Medium if quality improvement / Low if cosmetic]
```

**Example:**
```
Title: Update github-pr-workflow skill — add rebase step

Context:
github-pr-workflow skill is missing the rebase step that's needed when main branch has moved ahead. jukes-coding-agent hit merge conflicts and had to manually figure out the rebase workflow.

Discovered during: Dashboard PR #47 merge, main had 3 commits ahead.

Current issue:
Skill jumps from "CI passes" to "merge" without handling case where main branch has advanced.

Acceptance criteria:
[see template above]

Update type:
- [x] Minor (add step, update command)

Changes needed:

Old approach (step 6):
```
6. Merge PR
gh pr merge --squash
```

New approach (step 6):
```
6. Rebase if main has advanced
# Check if main is ahead
git fetch origin main
git log HEAD..origin/main --oneline

# If output shows commits, rebase:
git pull --rebase origin main
git push --force-with-lease

# Then merge
gh pr merge --squash
```

Supporting files:
- None needed

Assignee: jukes-coding-agent
Priority: High (blocks smooth PR merges)
```

---

## Template: Remove Obsolete Skill

**Title:** Remove [skill-name] skill — [reason]

**Body:**
```
## Context
[Skill-name] should be removed because [obsolete / better alternative / unused / security risk].

Last used: [date or "never"]
Reason: [Why removing]

## Acceptance criteria
- [ ] Skill removed from all profiles using it
- [ ] GOALS.md updated (line removed)
- [ ] Removal reason documented
- [ ] Alternative documented if applicable
- [ ] Any Kanban tasks referencing this skill updated

## Profiles using this skill
- [ ] [profile-1]: remove
- [ ] [profile-2]: remove

## Removal reason
- [ ] Obsolete (workflow no longer relevant)
- [ ] Better alternative exists: [alternative-skill]
- [ ] Unused (90+ days)
- [ ] Security risk: [describe]
- [ ] Maintenance burden > value

## Alternative
[If replaced by another skill/approach, describe it]

## Assignee
[jukes-librarian for coordination or specific agent for domain-specific skill]

## Priority
[High if security risk / Medium if cleanup / Low if cosmetic]
```

**Example:**
```
Title: Remove manual-stripe-test skill — replaced by stripe-health-check

Context:
manual-stripe-test skill should be removed because we now have automated stripe-health-check skill that's safer (doesn't expose secrets) and more comprehensive.

Last used: 2026-03-12 (57 days ago)
Reason: Superseded by better skill

Acceptance criteria:
[see template above]

Profiles using this skill:
- [x] jukes-ops-agent: remove

Removal reason:
- [x] Better alternative exists: stripe-health-check
- [x] Security risk: old skill printed partial API keys in output

Alternative:
Use stripe-health-check skill instead:
- Doesn't expose secrets
- More comprehensive checks
- Better error handling
- Automated report generation

Assignee: jukes-ops-agent
Priority: High (security: old skill exposes secrets)
```

---

## Quick reference: Which template to use?

| Scenario | Template |
|----------|----------|
| Need to install a bundled Hermes skill | Install Bundled Skill |
| Found a GitHub skill to evaluate | Inspect and Install GitHub Skill |
| Completed complex task 5+ times, should save | Create New Skill |
| Existing skill is wrong/incomplete | Update Existing Skill |
| Skill is obsolete/unused | Remove Obsolete Skill |

---

## Kanban workflow integration

### 1. Triage → Ready
Librarian triages skill acquisition cards:
- Validates skill matches agent scope
- Checks for overlaps with existing skills
- Assigns to appropriate agent
- Marks ready when spec is clear

### 2. Ready → In Progress
Assigned agent picks up card:
- Follows template steps
- Completes acceptance criteria
- Documents as they go

### 3. In Progress → Review (optional)
For GitHub skills or complex skill creation:
- Second agent reviews for security/quality
- Ops agent reviews for guardrails compliance
- Editor reviews for documentation quality

### 4. Review → Done
After verification:
- All acceptance criteria met
- GOALS.md updated
- Brain documented
- Card completed with summary

---

## Examples by agent

### jukes-research-agent skill acquisition
```
Title: Install maps skill
Priority: High
Assignee: jukes-research-agent
Template: Install Bundled Skill
Rationale: Unblocks Nashville venue/vendor research
```

### jukes-coding-agent skill acquisition
```
Title: Install test-driven-development skill
Priority: High
Assignee: jukes-coding-agent
Template: Install Bundled Skill
Rationale: Enforces TDD workflow per GOALS.md
```

### jukes-qa-agent skill acquisition
```
Title: Inspect playwright-testing GitHub skill
Priority: Medium
Assignee: jukes-ops-agent (security), jukes-qa-agent (testing)
Template: Inspect and Install GitHub Skill
Rationale: Automate browser testing, needs security review first
```

### jukes-ops-agent skill creation
```
Title: Create deployment-checklist skill
Priority: High
Assignee: jukes-ops-agent
Template: Create New Skill
Rationale: Weekly deployment workflow, 8+ steps, error-prone
```

---

## Tips for writing good skill cards

1. **Be specific in title:** "Install maps skill for jukes-research-agent" not "Install skill"
2. **Provide context:** Why does this agent need this skill? What problem does it solve?
3. **Clear acceptance:** Checkboxes for each verification step
4. **Right assignee:** Agent who will use the skill should install it
5. **Realistic priority:** Don't mark everything high
6. **Link to resources:** Reference skill name, GitHub URL, existing documentation
7. **Guardrails:** Remind about security checks, scope boundaries, secret handling

---

Last updated: 2026-05-08
