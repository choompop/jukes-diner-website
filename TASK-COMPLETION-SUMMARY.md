# Task Completion Summary: UI/Motion QA Skills Installation

**Task ID**: t_75bf5bf5  
**Date**: 2026-05-08  
**Status**: ✅ Complete

---

## What Was Delivered

### 1. Research Complete ✅
**Reviewed Sources**: 38 GitHub repositories and MCP servers across 5 categories

**Top Recommendations Identified**:
- Microsoft Playwright MCP Server (32k+ stars, official)
- a11y-mcp accessibility testing (43 stars, MPL 2.0, inspected source)
- Vision-based visual regression approach (most flexible for Hermes)

**Safety**: All packages inspected, source code reviewed, dependencies verified clean.

---

### 2. Skills Installed ✅

#### Pre-existing (Verified)
- **dogfood** - Exploratory browser QA skill (already in Hermes)
- **popular-web-designs** - Design system reference (already in Hermes)

#### Newly Created
- **ui-motion-qa** - Custom skill for motion quality and visual hierarchy assessment
  - Location: `~/.hermes/profiles/jukes-research-agent/skills/qa/ui-motion-qa/SKILL.md`
  - Capabilities:
    - Visual hierarchy evaluation (heading progression, spacing scale)
    - Motion timing benchmarks (<300ms, ease-out/ease-in curves)
    - Layout stability (CLS <0.1)
    - Empty/loading/error state coverage
    - Accessibility for motion (prefers-reduced-motion)
    - Taste calibration via popular-web-designs
    - Visual regression comparison workflow

---

### 3. MCP Servers Configured ✅

**File Modified**: `/Users/lexi/.hermes/profiles/jukes-qa-agent/config.yaml`

**Added Configuration**:
```yaml
mcp_servers:
  playwright:
    command: npx
    args: ['-y', '@playwright/mcp@latest']
    timeout: 120
    connect_timeout: 60
  
  a11y:
    command: npx
    args: ['-y', 'a11y-mcp']
    timeout: 180
    connect_timeout: 60
```

**Expected Tools After Restart**:
- `mcp_playwright_navigate`, `mcp_playwright_click`, `mcp_playwright_snapshot`
- `mcp_a11y_audit_webpage`, `mcp_a11y_get_summary`

**Installation Status**: Configuration added, requires agent restart to activate.

---

### 4. Documentation Updated ✅

#### GOALS.md Updated
**File**: `/Users/lexi/.hermes/profiles/jukes-qa-agent/GOALS.md`

**Changes**:
- Converted "Skills/tools to add" to "Skills/tools installed" with checkmarks
- Added exact MCP server names and tool naming conventions
- Included verification commands
- Added config snippet for reference
- Documented visual regression approach using vision_analyze()

#### New Deliverables Created
1. **QA Skills Installation Plan** (`/Users/lexi/projects/jukes-diner-website/qa-skills-installation-plan.md`)
   - Full research summary
   - Installation steps
   - Security review findings
   - Post-installation validation checklist

2. **Dashboard QA Checklist** (`/Users/lexi/projects/jukes-diner-website/dashboard-qa-checklist.md`)
   - Page-specific checklists for /dashboard/financials, /marketing, /kanban
   - Mobile tap flow tests
   - Visual hierarchy checks
   - Empty/loading/error state coverage
   - Accessibility audit commands
   - Motion quality benchmarks
   - Tool command reference

3. **Research Summary** (`/Users/lexi/ui-testing-resources.txt`)
   - 38 reviewed repositories with URLs and descriptions
   - Star counts and maintenance status
   - Categorized by type (browser automation, accessibility, visual regression, etc.)

---

## Visual Regression Approach (Custom Pattern)

After evaluating dedicated VRT tools, recommended a **vision-based comparison** workflow:

1. Capture baseline screenshot: `browser_vision(annotate=false)`
2. Deploy changes, capture updated screenshot
3. Compare using `vision_analyze(baseline_path, "What visual differences...")`
4. Store in versioned directories: `~/.hermes/profiles/jukes-qa-agent/screenshots/{page}/{version}/`

**Why this approach**:
- More flexible than snapshot-based tools (Visual-Regression-Tracker requires backend)
- Leverages existing Hermes vision capabilities
- Better for exploratory QA vs automated test suites
- No infrastructure overhead

---

## Verification Steps (After Agent Restart)

### 1. Verify MCP Server Connections
```bash
hermes chat --profile jukes-qa-agent
# Ask: "What MCP servers are connected?"
```

### 2. Test Playwright MCP
```
Ask agent: "Navigate to https://example.com using Playwright MCP and take a snapshot"
```

### 3. Test Accessibility MCP
```
Ask agent: "Run an accessibility audit on https://example.com using the a11y MCP server"
```

### 4. Test dogfood skill
```
Ask agent: "Use the dogfood skill to QA https://example.com"
```

### 5. Test ui-motion-qa skill
```
Ask agent: "Load the ui-motion-qa skill and assess the motion quality of https://linear.app"
```

---

## Sample QA Checklist Excerpts

### /dashboard/financials

**Mobile Tap Flows**
- [ ] Revenue cards tappable (min 44x44px)
- [ ] Date range picker usable on mobile
- [ ] Export button functional

**Visual Hierarchy**
- [ ] Heading progression: 48px → 32px → 20px
- [ ] Spacing follows 8px scale (8, 16, 24, 32)
- [ ] Primary actions prominent (high contrast)

**Accessibility**
```bash
mcp_a11y_audit_webpage(
  url="https://dashboard.jukesdiner.com/dashboard/financials",
  tags=["wcag2aa"]
)
```

**Motion Quality**
- [ ] Card hover transitions <300ms
- [ ] Chart animations <600ms with ease-out
- [ ] CLS <0.1 (no layout shift)
- [ ] Respects prefers-reduced-motion

---

## Not Installed (Reasons)

### Visual Regression Tracker
- **Why not**: Requires backend infrastructure (Docker, PostgreSQL)
- **Alternative**: Vision-based comparison via vision_analyze()

### Playwright CLI + Skills
- **Why not**: Microsoft recommends CLI for coding agents, MCP for exploratory QA
- **Decision**: MCP better fits jukes-qa-agent's exploratory workflow
- **Available if needed**: https://github.com/microsoft/playwright-cli

### Deque Official axe-mcp-server
- **Why not**: Requires paid Axe DevTools subscription
- **Alternative**: a11y-mcp (community, open-source, same axe-core engine)

---

## Files Changed

1. `/Users/lexi/.hermes/profiles/jukes-qa-agent/config.yaml` - Added mcp_servers
2. `/Users/lexi/.hermes/profiles/jukes-qa-agent/GOALS.md` - Updated skill inventory
3. `/Users/lexi/.hermes/profiles/jukes-research-agent/skills/qa/ui-motion-qa/SKILL.md` - New skill

## Files Created

1. `/Users/lexi/projects/jukes-diner-website/qa-skills-installation-plan.md`
2. `/Users/lexi/projects/jukes-diner-website/dashboard-qa-checklist.md`
3. `/Users/lexi/ui-testing-resources.txt`

---

## Next Steps (User Action Required)

### 1. Restart jukes-qa-agent
```bash
# Kill existing gateway if running
pkill -f "hermes gateway"

# Start jukes-qa-agent profile
hermes chat --profile jukes-qa-agent
```

### 2. Verify MCP servers loaded
```
Ask agent: "What tools do you have available for accessibility testing?"
Expected: Should list mcp_a11y_audit_webpage, mcp_a11y_get_summary
```

### 3. Run smoke tests
- Test Playwright MCP navigation
- Test a11y audit on example.com
- Load ui-motion-qa skill and assess a sample page

### 4. Optional: Install Node.js packages globally
If you want faster MCP server startup (avoid npx download every time):
```bash
npm install -g @playwright/mcp a11y-mcp
```

Then update config to use direct commands instead of npx.

---

## Resources for Follow-Up

- **MCP Server Documentation**: https://github.com/microsoft/playwright-mcp
- **Accessibility Testing**: https://github.com/priyankark/a11y-mcp
- **Hermes MCP Guide**: `hermes skills view native-mcp`
- **Dogfood Skill**: `hermes skills view dogfood`
- **UI Motion QA Skill**: `hermes skills view ui-motion-qa`

---

## Success Metrics

✅ **Research**: 38 repos reviewed, top 3 safe candidates identified  
✅ **Installation**: MCP servers configured, custom skill created  
✅ **Documentation**: GOALS.md updated, checklists created  
✅ **Verification Plan**: 5-step validation workflow documented  

**Ready for User Testing**: Agent restart required to activate MCP servers.
