# UI/Motion QA Skills Installation Plan for jukes-qa-agent

## Executive Summary

Researched and evaluated UI testing, accessibility, and visual regression tooling from the Hermes/MCP ecosystem and open-source community. Identified safe, maintainable solutions ready for installation.

**Status**: ✅ Research complete, ready for installation
**Date**: 2026-05-08

---

## Skills & Tools Inventory

### 1. Already Installed ✅
- **dogfood** (Hermes built-in skill)
  - Location: `~/.hermes/profiles/jukes-research-agent/skills/dogfood`
  - Capabilities: Exploratory browser QA, screenshot evidence, bug reports
  - Verification: `hermes skills list | grep dogfood`

### 2. Recommended MCP Servers for Installation

#### A. Playwright MCP Server (Microsoft Official)
- **Package**: `@playwright/mcp@latest`
- **Source**: https://github.com/microsoft/playwright-mcp (32k+ stars)
- **Safety**: ✅ Official Microsoft repo, actively maintained
- **Capabilities**: Browser automation via accessibility tree (no vision model needed)
- **Installation method**: MCP config in `~/.hermes/config.yaml`

```yaml
mcp_servers:
  playwright:
    command: "npx"
    args: ["-y", "@playwright/mcp@latest"]
    timeout: 120
```

**Tool naming**: `mcp_playwright_*` (e.g., `mcp_playwright_navigate`, `mcp_playwright_click`)

**Notes**: Microsoft recommends CLI+SKILLS over MCP for coding agents due to token efficiency, but MCP is better for exploratory QA workflows with persistent browser state.

#### B. Accessibility Testing MCP Server
- **Package**: `a11y-mcp` (community, 43 stars)
- **Source**: https://github.com/priyankark/a11y-mcp
- **Safety**: ✅ Open-source (MPL 2.0), clean dependencies, inspected source
- **Dependencies**: `@axe-core/puppeteer`, `axe-core`, `puppeteer`
- **Capabilities**: 
  - WCAG 2.1 AA/AAA audits via axe-core
  - Agentic loop support (auto-fix suggestions)
  - HTML snippet extraction for debugging

```yaml
mcp_servers:
  a11y:
    command: "npx"
    args: ["-y", "a11y-mcp"]
    timeout: 180
```

**Tool naming**: `mcp_a11y_audit_webpage`, `mcp_a11y_get_summary`

**Alternative considered**: Deque's official `axe-mcp-server-public` requires paid subscription, so using community alternative.

### 3. Visual Regression Testing (NOT installing as MCP)

After review, visual regression is best handled as a **skill pattern** rather than MCP server:

**Recommended approach**:
- Use browser toolset's `browser_vision()` with `annotate=false` to capture baseline screenshots
- Store screenshots in a versioned directory structure
- Use vision AI to compare before/after screenshots on demand
- Create custom skill for dashboard-specific visual regression workflows

**Why not a dedicated MCP server**:
- Visual-Regression-Tracker requires backend infrastructure (not suitable for Hermes)
- Playwright's built-in screenshot comparison requires persistent test files
- Vision-based comparison via `vision_analyze()` is more flexible for exploratory QA

### 4. Motion/Design QA (Skill to create)

**Recommendation**: Create custom skill `ui-motion-qa` combining:
- `browser_vision()` for visual inspection
- `popular-web-designs` skill for taste calibration
- Design principles checklist (spacing, hierarchy, motion timing)

---

## Installation Steps

### Step 1: Add MCP Servers to jukes-qa-agent config

Edit `/Users/lexi/.hermes/profiles/jukes-qa-agent/config.yaml`:

```yaml
mcp_servers:
  playwright:
    command: "npx"
    args: ["-y", "@playwright/mcp@latest"]
    timeout: 120
    connect_timeout: 60
  
  a11y:
    command: "npx"
    args: ["-y", "a11y-mcp"]
    timeout: 180
    connect_timeout: 60
```

### Step 2: Update GOALS.md

Add exact tool names and verification commands to `/Users/lexi/.hermes/profiles/jukes-qa-agent/GOALS.md`.

### Step 3: Create custom `ui-motion-qa` skill

Author a new skill under `~/.hermes/profiles/jukes-qa-agent/skills/qa/ui-motion-qa/` with:
- Motion quality checklist
- Visual hierarchy assessment
- Spacing/typography guidelines
- Integration with `browser_vision()` and `popular-web-designs`

### Step 4: Verification

Restart Hermes Agent for jukes-qa-agent profile:

```bash
# Kill existing gateway if running
pkill -f "hermes gateway"

# Start jukes-qa-agent profile
hermes chat --profile jukes-qa-agent
```

Verify tools loaded:
```
Ask agent: "What tools do you have available for accessibility testing?"
Expected response should include: mcp_a11y_audit_webpage, mcp_a11y_get_summary
```

---

## Sample QA Checklist for Dashboard Pages

Based on GOALS.md requirements, here's the QA workflow for `/dashboard/financials`, `/dashboard/marketing`, and Kanban pages:

### Pre-test Setup
1. Navigate to target page
2. Take baseline screenshot with `browser_vision(annotate=true)`
3. Check browser console for JS errors
4. Capture accessibility tree snapshot

### Mobile Tap Flow Testing
- [ ] All primary CTAs tappable (min 44x44px touch target)
- [ ] Forms usable on mobile viewport
- [ ] No horizontal scroll on 375px width
- [ ] Navigation drawer/hamburger functional

### Visual Hierarchy & Spacing
- [ ] Headings follow size progression (H1 > H2 > H3)
- [ ] Consistent spacing scale (8px/16px/24px/32px)
- [ ] Important actions visually prominent
- [ ] White space creates clear sections

### Empty/Loading/Error States
- [ ] Empty state has helpful message + CTA
- [ ] Loading spinners appear within 200ms
- [ ] Error messages actionable (not just "Error 500")
- [ ] Skeleton loaders match final content layout

### Accessibility (axe-core via a11y-mcp)
- [ ] Color contrast ≥4.5:1 for normal text, ≥3:1 for large
- [ ] All interactive elements keyboard-navigable (Tab order logical)
- [ ] Form inputs have associated labels
- [ ] Focus indicators visible
- [ ] ARIA landmarks present (main, nav, complementary)

### Motion Quality
- [ ] Transitions <300ms (feel snappy, not sluggish)
- [ ] Easing curves natural (ease-out for entrances, ease-in for exits)
- [ ] No layout shift (CLS <0.1)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Hover states have 150-200ms delay tolerance

### Regression Risk
- [ ] Financial calculations still accurate after UI changes
- [ ] Media uploads functional
- [ ] Kanban drag-drop works
- [ ] Franchise Brain query results render correctly

---

## Resources Reviewed (Full List)

### Browser Automation
1. ✅ **microsoft/playwright-mcp** (32k stars) - SELECTED
2. browser-use/browser-use (92k stars) - Python-focused, too heavyweight
3. browserbase/stagehand (22k stars) - Commercial SDK, not MCP
4. apify/crawlee (23k stars) - Crawling focus, overkill for QA
5. Skyvern-AI/skyvern (21k stars) - Workflow automation, not interactive QA

### Accessibility Testing
1. ✅ **priyankark/a11y-mcp** (43 stars) - SELECTED
2. dequelabs/axe-mcp-server-public (4 stars) - Requires paid subscription
3. JustasMonkev/mcp-accessibility-scanner (48 stars) - Similar to #1, less active
4. deepakkamboj/playwright-accessibility-mcp-server (1 star) - Low adoption
5. web-DnA/navable-web-accessibility-mcp (1 star) - Localhost-only focus

### Visual Regression
1. Visual-Regression-Tracker (686 stars) - Requires backend infra
2. americanexpress/jest-image-snapshot (3.9k stars) - Jest test framework dep
3. happo/happo (511 stars) - Commercial service
4. mojoaxel/awesome-regression-testing (2.3k stars) - Reference list
5. ✅ **Vision-based approach via browser_vision()** - SELECTED (most flexible)

### Hermes Community
1. Kevin-Liu-01/Agent-Machines (95 skills + 17 MCP services) - Worth exploring later
2. NextAgentX/HermesClaw - Desktop UI integration, out of scope
3. clowlove/Harmes-House - Skills collection, needs inspection

---

## Security Review Summary

All selected packages inspected for safety:

### @playwright/mcp
- ✅ Official Microsoft repository
- ✅ Clean package.json, no suspicious dependencies
- ✅ Actively maintained (last commit <7 days)
- ✅ Transparent commit history

### a11y-mcp
- ✅ Open-source MPL 2.0 license
- ✅ Dependencies: @axe-core/puppeteer (Deque official), puppeteer (Google), @modelcontextprotocol/sdk
- ✅ Source code reviewed - straightforward wrapper around axe-core
- ✅ No network calls to external services
- ✅ No credential requirements

**Conclusion**: Both packages safe for installation. No untrusted code execution risk.

---

## Post-Installation Validation

After installing MCP servers and restarting the agent, run these verification checks:

1. **MCP Connection Status**
   ```
   Ask agent: "Check your MCP server connections"
   Expected: playwright and a11y servers connected
   ```

2. **Tool Discovery**
   ```
   Ask agent: "List all tools with 'mcp_' prefix"
   Expected: mcp_playwright_*, mcp_a11y_* tools visible
   ```

3. **Playwright Smoke Test**
   ```
   Ask agent: "Navigate to https://example.com using Playwright MCP and take a snapshot"
   Expected: Successful navigation, accessibility tree returned
   ```

4. **Accessibility Smoke Test**
   ```
   Ask agent: "Run an accessibility audit on https://example.com using the a11y MCP server"
   Expected: axe-core results with violations/passes/incomplete/inapplicable counts
   ```

5. **Dogfood Skill Integration**
   ```
   Ask agent: "Use the dogfood skill to QA https://dashboard.jukesdiner.com/dashboard/financials"
   Expected: Full 5-phase QA workflow with screenshot evidence
   ```

---

## Next Steps (Post-Installation)

1. **Create ui-motion-qa skill** - Custom skill for motion/design quality assessment
2. **Build dashboard-specific QA checklist** - Tailored for Juke's Diner dashboard patterns
3. **Test on live dashboard pages** - Run full QA on /financials, /marketing, /kanban
4. **Document common failure modes** - Build knowledge base of dashboard-specific pitfalls
5. **Integrate with kanban workflow** - QA tasks spawn from dev completions

---

## References

- Research summary: `/Users/lexi/ui-testing-resources.txt`
- MCP server inspection: `/tmp/playwright-mcp-inspect`, `/tmp/a11y-mcp-inspect`
- Hermes MCP docs: `native-mcp` skill
- Dogfood skill: `~/.hermes/profiles/jukes-research-agent/skills/dogfood/SKILL.md`
