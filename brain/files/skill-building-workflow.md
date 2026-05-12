# Skill-Building Workflow for Juke's Specialist Agents

**Status:** Complete  
**Created:** 2026-05-08  
**Owner:** jukes-research-agent  
**Related Kanban Task:** t_b0a96d58

---

## Overview

This workflow defines how Juke's specialist agents discover, install, use, create, and maintain skills. Skills are the procedural memory that makes agents effective at their domains.

---

## Core documents

### 1. Agent Skill Recommendations
**Location:** `brain/files/agent-skill-recommendations.md`

Per-agent recommended skills mapped to each profile's mission:
- jukes-research-agent (competitive intel, vendor/tool research)
- jukes-coding-agent (dashboard development)
- jukes-finance-agent (bookkeeping, cashflow analysis)
- jukes-ops-agent (deployment, monitoring, integration reliability)
- jukes-email-agent (email triage, action item extraction)
- jukes-editor (brand voice, content quality)
- jukes-qa-agent (UI/motion testing, accessibility)
- jukes-librarian (Kanban triage, orchestration)
- jukes-social-agent / Flo (internal comms, TBD)

**Priority levels:**
- **High priority:** Install immediately (unblocks core workflows)
- **Medium priority:** Install as needed (nice-to-have)
- **GitHub skills:** Inspect first, install after security review

### 2. GitHub Skill Inspection Workflow
**Location:** `brain/files/github-skill-inspection.md`

Safe installation process for community/GitHub skills:
1. Initial assessment (trust signals, scope validation)
2. Clone to temporary directory
3. Read SKILL.md carefully
4. Inspect all linked files (scripts, templates, references)
5. Check dependencies
6. Test in isolated environment
7. Validate against Juke's guardrails
8. Decision: install / fix / reject

**Security red flags:**
- Hardcoded secrets
- Destructive commands without safeguards
- Unknown network calls
- Privilege escalation
- Obfuscated code
- Writes to sensitive paths

**Maintenance:**
- Monthly audits for updates
- Check for security issues
- Remove unused skills (90+ days)

### 3. Skill Creation Guidelines
**Location:** `brain/files/skill-creation-guidelines.md`

When and how to create new skills:

**Create when:**
- Complex task succeeded (5+ tool calls)
- Error overcome with reusable solution
- User-corrected approach that worked
- Non-trivial recurring workflow
- User says "remember this"

**Don't create when:**
- One-time task
- Simple workflow (1-2 calls)
- Already covered by existing skill
- Failed/abandoned approach

**Good skill structure:**
- Clear "When to use" section
- Numbered workflow steps
- Exact commands
- Pitfalls section
- Verification steps
- Real examples

**Update triggers:**
- Instructions stale
- Missing steps found during use
- Pitfalls discovered
- Better approach found
- Security issue

### 4. Kanban Card Templates
**Location:** `brain/files/skill-acquisition-card-template.md`

Five templates for skill-related Kanban cards:

1. **Install Bundled Skill** — Add Hermes bundled skill to profile
2. **Inspect and Install GitHub Skill** — Security review + installation
3. **Create New Skill** — Capture recurring workflow as skill
4. **Update Existing Skill** — Fix/improve existing skill
5. **Remove Obsolete Skill** — Clean up unused/obsolete skills

Each template includes:
- Context (why needed)
- Acceptance criteria (checkboxes)
- Step-by-step workflow
- Verification steps
- Assignee guidance
- Priority guidance

---

## Agent GOALS.md updates

Updated `jukes-research-agent/GOALS.md` with:
- Link to agent-skill-recommendations.md
- High-priority skills to install
- Medium-priority skills
- GitHub skill inspection guidance
- Skill creation triggers

**Next:** Update remaining 8 agent GOALS.md files with similar skill workflow sections.

---

## Quick start guide

### For agents installing bundled skills:
```bash
# 1. Check recommendations
cat /Users/lexi/projects/jukes-diner-website/brain/files/agent-skill-recommendations.md

# 2. View skill details
skill_view(name='skill-name')

# 3. Install to profile
hermes skills add skill-name --profile agent-name

# 4. Update GOALS.md
echo "- \`skill-name\` — description" >> ~/.hermes/profiles/agent-name/GOALS.md

# 5. Test
hermes chat --profile agent-name
```

### For agents installing GitHub skills:
```bash
# 1. Read inspection workflow
cat /Users/lexi/projects/jukes-diner-website/brain/files/github-skill-inspection.md

# 2. Clone to temp directory
mkdir -p ~/tmp/skill-inspection
cd ~/tmp/skill-inspection
git clone <repo-url>

# 3. Follow full inspection checklist
# (see github-skill-inspection.md for complete steps)

# 4. Install if approved
hermes skills add ~/tmp/skill-inspection/skill-name --profile agent-name

# 5. Clean up
rm -rf ~/tmp/skill-inspection/skill-name
```

### For agents creating skills:
```bash
# 1. After completing complex task, ask user:
"Should I save this workflow as a skill for future use?"

# 2. If yes, read guidelines
cat /Users/lexi/projects/jukes-diner-website/brain/files/skill-creation-guidelines.md

# 3. Create skill
skill_manage(
    action="create",
    name="skill-name",
    category="appropriate-category",
    content="[full SKILL.md with structure from guidelines]"
)

# 4. Test immediately
skill_view(name='skill-name')

# 5. Update GOALS.md
```

---

## Skill lifecycle summary

```
┌───────────┐
│  Discover │ → Research recommendations, GitHub search
└─────┬─────┘
      ↓
┌───────────┐
│  Inspect  │ → Security review (GitHub skills only)
└─────┬─────┘
      ↓
┌───────────┐
│  Install  │ → Add to profile, test, document
└─────┬─────┘
      ↓
┌───────────┐
│    Use    │ → Apply to tasks, discover gaps
└─────┬─────┘
      ↓
┌───────────┐
│  Update   │ → Fix issues, add pitfalls, improve
└─────┬─────┘
      ↓
┌───────────┐
│  Retire   │ → Remove unused/obsolete (90+ days)
└───────────┘
```

---

## Integration with existing workflows

### Kanban board integration
- Use skill-acquisition-card-template.md for all skill-related cards
- Librarian triages skill cards during 10-minute loop
- Assigns to appropriate agent for installation/creation
- Ops agent reviews GitHub skills for security

### Juke's Brain integration
- All skill workflow docs live in `brain/files/`
- Per-skill usage notes in `brain/files/skills/` (future)
- Agent GOALS.md references skill workflow docs

### Dashboard integration (future)
- Skill inventory view showing installed skills per agent
- Skill health dashboard (last used, update available, etc.)
- Skill recommendation engine based on task patterns

---

## Maintenance schedule

### Weekly (automated via Kanban)
- Check for high-priority skill installations pending
- Review skill-related cards in triage

### Monthly (manual or automated)
- Audit installed skills per profile
- Check for updates to GitHub skills
- Review usage stats, remove unused (90+ days)
- Consolidate overlapping skills

### Quarterly
- Review skill recommendations for each agent
- Update guidelines based on lessons learned
- Audit security of all GitHub skills

---

## Success metrics

### Installation coverage
- [ ] Each agent has ≥3 high-priority skills installed
- [ ] No duplicate skills across profiles
- [ ] All GitHub skills have passed security review

### Quality
- [ ] Created skills have "When to use" section
- [ ] Created skills have pitfalls documented
- [ ] Created skills tested before deployment

### Maintenance
- [ ] No skills unused > 90 days
- [ ] All skills updated when stale
- [ ] Security issues addressed within 7 days

---

## Next steps

### Immediate (this task)
- [x] Create agent-skill-recommendations.md
- [x] Create github-skill-inspection.md
- [x] Create skill-creation-guidelines.md
- [x] Create skill-acquisition-card-template.md
- [x] Update jukes-research-agent/GOALS.md
- [ ] Create Obsidian note linking to this index

### Short-term (next sprint)
- [ ] Update remaining 8 agent GOALS.md files
- [ ] Install high-priority skills for each agent
- [ ] Create Kanban cards for skill installations
- [ ] Test skill workflow with one GitHub skill

### Long-term (next month)
- [ ] Build skill inventory dashboard view
- [ ] Create automated skill usage tracking
- [ ] Develop skill recommendation engine
- [ ] Monthly skill audit automation

---

## References

### Files created in this task:
1. `/Users/lexi/projects/jukes-diner-website/brain/files/agent-skill-recommendations.md`
2. `/Users/lexi/projects/jukes-diner-website/brain/files/github-skill-inspection.md`
3. `/Users/lexi/projects/jukes-diner-website/brain/files/skill-creation-guidelines.md`
4. `/Users/lexi/projects/jukes-diner-website/brain/files/skill-acquisition-card-template.md`
5. This index: `/Users/lexi/projects/jukes-diner-website/brain/files/skill-building-workflow.md`

### Updated files:
1. `/Users/lexi/.hermes/profiles/jukes-research-agent/GOALS.md`

### Hermes documentation:
- Skill system: https://hermes-agent.nousresearch.com/docs/skills
- Profile management: https://hermes-agent.nousresearch.com/docs/profiles
- Tool documentation: Built-in `skill_manage`, `skill_view`, `skills_list` tools

---

## Contact

**Questions about this workflow?**
- Create Kanban card with `assignee: jukes-research-agent`
- Tag with `skill-workflow` for tracking
- Reference this index document

---

Last updated: 2026-05-08 by jukes-research-agent
