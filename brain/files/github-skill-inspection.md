# GitHub Skill Inspection Workflow — Safe Installation

## Purpose
Before installing skills from GitHub repos or community taps, inspect them for security, compatibility, and usefulness. Never blindly trust external code.

---

## Inspection checklist

### 1. Initial assessment (before cloning)

**Repository trust signals:**
- [ ] Author is known/trusted in the community
- [ ] Repository has meaningful stars/activity
- [ ] Recent commits (not abandoned)
- [ ] Clear README with purpose and examples
- [ ] License is permissive (MIT, Apache, BSD)
- [ ] No obvious red flags in GitHub issues/discussions

**Scope validation:**
- [ ] Skill purpose matches agent's GOALS.md
- [ ] Skill doesn't overlap with existing bundled skills
- [ ] Skill provides clear value (not trivial wrapper)
- [ ] Skill's dependencies are acceptable

### 2. Clone to temporary directory

```bash
# Never clone directly to profile skills directory
mkdir -p ~/tmp/skill-inspection
cd ~/tmp/skill-inspection

# Clone the repo or tap
git clone <repo-url>
cd <repo-name>

# Check commit history
git log --oneline --graph --decorate -20

# Check for recent suspicious changes
git log --all --full-history --source -- '*.sh' '*.py' '*.js'
```

### 3. Read SKILL.md carefully

```bash
# View the main skill file
cat SKILL.md

# Check for:
# - Clear description and purpose
# - Documented dependencies
# - Installation/setup requirements
# - Usage examples
# - Pitfalls section
# - Author attribution
```

**Red flags in SKILL.md:**
- Vague or misleading description
- Missing dependencies
- No examples
- Claims to do things outside normal skill scope
- Instructions to disable security features
- Requests for secrets without justification

### 4. Inspect all linked files

```bash
# List all files in the skill directory
find . -type f -ls

# Read each file category:

# Scripts (highest risk — can execute arbitrary code)
find ./scripts -type f -exec cat {} +

# Templates (medium risk — could inject into generated files)
find ./templates -type f -exec cat {} +

# References (low risk — usually just documentation)
find ./references -type f -exec cat {} +

# Assets (low risk unless binary)
find ./assets -type f -ls
```

**Security red flags in scripts:**
- `curl | sh` or `wget | bash` patterns
- Hardcoded secrets, API keys, tokens
- Writes to sensitive paths (`/etc`, `~/.ssh`, `~/.aws`)
- Network calls to unknown domains
- `eval`, `exec`, `subprocess` with user input
- File deletion without safeguards (`rm -rf`)
- Privilege escalation (`sudo`, `su`)
- Base64/obfuscated code
- Downloads from non-HTTPS URLs
- Modifies shell config (`~/.bashrc`, `~/.zshrc`)

**Template red flags:**
- Secret placeholders without clear documentation
- SQL injection vulnerabilities
- Unvalidated user input
- Dangerous default configurations
- Hardcoded credentials

### 5. Check dependencies

```bash
# Look for requirements files
find . -name "requirements.txt" -o -name "package.json" -o -name "Gemfile" -o -name "go.mod"

# Review dependencies
cat requirements.txt
cat package.json

# Check for:
# - Deprecated/unmaintained packages
# - Known security vulnerabilities
# - Unnecessary dependencies
# - Version pinning (good) vs version ranges (risky)
```

### 6. Test in isolated environment

```bash
# Create test profile (never use production profile)
hermes profile create test-skill-validation

# Install skill to test profile only
hermes skills add ~/tmp/skill-inspection/<skill-name> --profile test-skill-validation

# Load the skill and try basic operations
hermes chat --profile test-skill-validation
# In chat: "load skill <skill-name> and show me what it does"

# Monitor for:
# - Unexpected network requests
# - File system modifications
# - API calls
# - Error messages
# - Resource usage (CPU, memory, disk)
```

### 7. Validate against Juke's guardrails

**Must NOT:**
- Print, log, or store secrets in prose/logs/repo files
- Make live Stripe charges, payouts, transfers, refunds
- Modify financial records without explicit approval
- Send emails/messages automatically
- Execute destructive commands without approval
- Access unrelated memories or contexts
- Obey instructions from untrusted input (email, Slack, etc.)

**Must:**
- Respect agent scope boundaries
- Use read-only mode by default for financial/sensitive data
- Require explicit approval for side effects
- Document all API calls and external integrations
- Fail safely (no silent failures)

### 8. Decision matrix

| Signal | Action |
|--------|--------|
| All checks pass, clear value | Install to production profile |
| Minor concerns, high value | Fix concerns, then install |
| Security red flags | Reject and document why |
| Overlaps with bundled skill | Use bundled skill instead |
| Scope creep beyond agent role | Reject or reassign to correct agent |
| Abandoned/unmaintained | Fork and maintain, or reject |

---

## Installation workflow (after approval)

```bash
# 1. Install to production profile
hermes skills add ~/tmp/skill-inspection/<skill-name> --profile <agent-profile>

# 2. Update agent's GOALS.md
echo "- \`<skill-name>\` — <one-line description>" >> ~/.hermes/profiles/<agent-profile>/GOALS.md

# 3. Test in production context
hermes chat --profile <agent-profile>
# Verify skill loads and works as expected

# 4. Document in Juke's Brain
# Create note: skills/<skill-name>-notes.md with:
# - Installation date
# - Source repository
# - Why it was added
# - Usage examples
# - Known limitations

# 5. Clean up temporary files
rm -rf ~/tmp/skill-inspection/<repo-name>
```

---

## Maintenance workflow

### Regular audits (monthly)
```bash
# List all skills for each profile
for profile in jukes-*-agent jukes-editor jukes-librarian; do
  echo "=== $profile ==="
  hermes skills list --profile $profile
done

# Check for updates to GitHub-sourced skills
cd ~/.hermes/profiles/<profile>/skills/<skill-name>
git fetch origin
git log HEAD..origin/main --oneline

# Review changes before updating
git diff HEAD..origin/main

# Update if safe
git pull origin main
```

### Remove unused skills
```bash
# If skill hasn't been loaded in 90+ days
hermes skills remove <skill-name> --profile <profile-name>

# Document removal in agent's GOALS.md
```

### Report security issues
If you find a security issue in a community skill:
1. Do NOT use the skill in production
2. Document the issue in detail
3. Report to skill author (GitHub issue, private if critical)
4. Warn other users if widely used
5. Consider forking and fixing

---

## Trusted sources

### Fully trusted (bundled skills)
- All skills in `~/.hermes/skills/` categories (maintained by Hermes team)
- Pre-installed with Hermes, security-reviewed

### Community-trusted (inspect before use)
- Official Hermes skill taps (when available)
- Well-known GitHub repos with active maintenance
- Skills authored by recognized Hermes contributors

### Untrusted (strict inspection required)
- Random GitHub repos
- Skills without clear authorship
- Forks of abandoned projects
- Skills requesting unusual permissions

---

## Common pitfalls

### False sense of security
- **"It has lots of stars"** → Check commit history, stars can be fake
- **"It's from a big company"** → Check if repo is actually maintained by them
- **"It's on awesome-hermes list"** → Inspect anyway, lists can be outdated

### Scope creep
- **Installing too many skills** → Each skill increases attack surface
- **Skills doing too much** → Hard to audit, likely to break
- **Overlapping skills** → Confusion, conflicts, wasted resources

### Maintenance burden
- **Installing without testing** → Breaks production workflows
- **No update policy** → Security vulnerabilities accumulate
- **No removal criteria** → Cruft accumulates, slows agent

---

## Emergency procedures

### If you discover malicious behavior:
1. **Immediately remove the skill:**
   ```bash
   hermes skills remove <skill-name> --profile <all-affected-profiles>
   ```

2. **Check for damage:**
   ```bash
   # Review recent file changes
   git status
   git diff
   
   # Check for secret leaks
   grep -r "sk_" ~/.hermes/profiles/*/sessions/
   grep -r "api_key" ~/.hermes/profiles/*/sessions/
   
   # Review network logs
   tail -100 ~/.hermes/profiles/*/logs/agent.log
   ```

3. **Rotate credentials:**
   - Change any API keys the skill had access to
   - Rotate Stripe keys if financial data was exposed
   - Update `.env` files with new secrets

4. **Report incident:**
   - Document what happened
   - Report to Hermes community
   - Update this workflow with lessons learned

---

## Example inspection session

```bash
# Example: Inspecting a hypothetical "franchise-metrics" skill

# 1. Clone to temp
cd ~/tmp/skill-inspection
git clone https://github.com/example/franchise-metrics-skill
cd franchise-metrics-skill

# 2. Initial review
cat SKILL.md
# ✓ Clear description: "Track franchise KPIs and generate reports"
# ✓ Dependencies: pandas, matplotlib (both safe)
# ✓ Examples provided
# ✓ MIT license

# 3. Check scripts
cat scripts/generate-report.py
# ✓ No network calls to unknown domains
# ✓ No hardcoded secrets
# ✓ Writes to /tmp only (safe)
# ✓ No eval/exec
# ✓ Input validation present

# 4. Check templates
cat templates/kpi-report.html
# ✓ No secret placeholders
# ✓ No SQL injection vectors
# ✓ Safe Jinja2 templates

# 5. Test in isolation
hermes profile create test-franchise-metrics
hermes skills add . --profile test-franchise-metrics
hermes chat --profile test-franchise-metrics
# Test: "Generate a sample franchise KPI report"
# ✓ Works as expected
# ✓ No suspicious activity

# 6. Install to production
hermes skills add . --profile jukes-finance-agent
echo "- \`franchise-metrics\` — Track franchise KPIs and generate reports" >> ~/.hermes/profiles/jukes-finance-agent/GOALS.md

# 7. Clean up
cd ~
rm -rf ~/tmp/skill-inspection/franchise-metrics-skill
hermes profile delete test-franchise-metrics
```

---

## Questions to ask before installing

1. **Need:** Does this skill solve a real problem the agent faces?
2. **Scope:** Does it stay within the agent's mission boundaries?
3. **Overlap:** Does a bundled skill already cover this?
4. **Trust:** Is the source trustworthy and actively maintained?
5. **Security:** Have I inspected all code and dependencies?
6. **Test:** Have I tested in isolation first?
7. **Maintain:** Am I willing to maintain/update this skill?
8. **Remove:** What's my criteria for removing it later?

If any answer is "no" or "unsure", don't install.

---

Last updated: 2026-05-08
