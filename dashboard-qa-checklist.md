# Dashboard QA Checklist - Juke's Diner

**Target Pages**: 
- `/dashboard/financials`
- `/dashboard/marketing` 
- `/dashboard/kanban`

**Tester**: jukes-qa-agent  
**Last Updated**: 2026-05-08

---

## Pre-Test Setup

### Environment Check
- [ ] Browser console clear (no pre-existing errors)
- [ ] Network tab open (monitor failed requests)
- [ ] Viewport set to target size (1920x1080 desktop, 375x667 mobile)
- [ ] Authentication valid (logged in as operator)

### Baseline Capture
```
1. browser_navigate(url="https://dashboard.jukesdiner.com/dashboard/financials")
2. browser_console() - Check for JS errors
3. browser_vision(question="Capture initial page state", annotate=true)
4. browser_snapshot() - Get accessibility tree
```

---

## /dashboard/financials

### Mobile Tap Flows
- [ ] **Revenue cards tappable** - Min 44x44px touch target
  - Test: Tap each revenue category card on 375px viewport
  - Expected: Card expands or navigates to detail view
  - Evidence: Screenshot of expanded state

- [ ] **Date range picker usable on mobile**
  - Test: Tap date input, select range on mobile calendar
  - Expected: Calendar modal renders without horizontal scroll
  - Evidence: Screenshot of calendar UI

- [ ] **Export button functional**
  - Test: Tap "Export CSV" or "Download Report"
  - Expected: Download initiates within 2 seconds
  - Evidence: Network tab shows successful file download

### Visual Hierarchy & Spacing
- [ ] **Heading progression clear** (H1 > H2 > H3)
  - Page title: 48px / 600 weight
  - Section headers: 32px / 600 weight
  - Card titles: 20px / 500 weight

- [ ] **Spacing follows 8px scale**
  - Section gaps: 32px
  - Card padding: 24px
  - Element margins: 8px/16px

- [ ] **Primary actions prominent**
  - "Generate Report" button: High contrast, primary color
  - Secondary actions (filters): Muted, smaller

### Empty/Loading/Error States
- [ ] **Empty revenue state** (no transactions yet)
  - Test: View financials for new franchise with $0 revenue
  - Expected: "No transactions yet" message + "Add Transaction" CTA
  - Evidence: Screenshot of empty state

- [ ] **Loading state** (fetching financial data)
  - Test: Reload page, observe skeleton loaders
  - Expected: Skeleton cards appear <200ms, actual data <2s
  - Evidence: Screenshot of skeleton UI

- [ ] **Error state** (API failure)
  - Test: Disconnect network, attempt to load financials
  - Expected: "Failed to load data" + "Retry" button (not generic 500)
  - Evidence: Screenshot of error message

### Accessibility (via mcp_a11y_audit_webpage)
```bash
# Run this command via agent
mcp_a11y_audit_webpage(url="https://dashboard.jukesdiner.com/dashboard/financials", tags=["wcag2aa"])
```

- [ ] **Color contrast** ≥4.5:1 for text
  - Body text on white: #1a1a1a (18.5:1) ✅
  - Secondary text: #666666 (5.74:1) ✅
  - Error messages: #d32f2f (4.8:1) ✅

- [ ] **Keyboard navigation**
  - Test: Tab through all interactive elements
  - Expected: Logical tab order (top→bottom, left→right)
  - Focus indicators visible (2px outline)

- [ ] **Form labels**
  - Date inputs have `<label>` or `aria-label`
  - Filter dropdowns have accessible names

- [ ] **ARIA landmarks**
  - `<main>` wraps content
  - `<nav>` for sidebar
  - Section headings use `<h2>` with proper nesting

### Motion Quality
- [ ] **Card hover transitions <300ms**
  - Test: Hover over revenue cards
  - Expected: Background color fades in 200ms with ease-out
  - Evidence: DevTools Performance recording

- [ ] **Chart animations feel natural**
  - Test: Load page with chart data
  - Expected: Bars/lines animate in with ease-out curve, complete <600ms
  - No jarring "snap" at the end

- [ ] **No layout shift (CLS <0.1)**
  - Test: Measure Cumulative Layout Shift in Lighthouse
  - Expected: CLS <0.1 (no jumping content as images/charts load)
  - Evidence: Lighthouse report screenshot

- [ ] **Respects prefers-reduced-motion**
  - Test: Enable "Reduce motion" in OS accessibility settings
  - Expected: Animations replaced with instant transitions
  - Evidence: Screenshot showing instant vs animated

### Regression Risk
- [ ] **Revenue calculations accurate**
  - Test: Compare dashboard total to sum of individual transactions
  - Expected: Totals match to the cent
  - Evidence: Console log of manual sum vs displayed total

- [ ] **Chart data matches table**
  - Test: Verify bar chart values against data table rows
  - Expected: Every bar height corresponds to exact table value

---

## /dashboard/marketing

### Mobile Tap Flows
- [ ] **Campaign cards tappable**
  - Min 44x44px touch target
  - Tap opens campaign details modal

- [ ] **Filter chips functional**
  - Tap "Active", "Paused", "Completed" filters
  - Results update without full page reload

- [ ] **Media upload button accessible**
  - Tap "Upload Image" on mobile
  - File picker opens

### Visual Hierarchy & Spacing
- [ ] **Campaign status visually distinct**
  - Active: Green badge, prominent
  - Paused: Yellow/orange badge
  - Completed: Gray badge, muted

- [ ] **Engagement metrics scannable**
  - Impressions / Clicks / Conversions in clear grid
  - Metric labels above numbers (not inline)

### Empty/Loading/Error States
- [ ] **No campaigns state**
  - Message: "No marketing campaigns yet"
  - CTA: "Create Campaign" button

- [ ] **Media upload in progress**
  - Progress bar with percentage
  - "Uploading..." text
  - Cancel button functional

- [ ] **Upload failed state**
  - Error: "Upload failed: File too large (max 5MB)"
  - Retry button + file size guidance

### Accessibility
```bash
mcp_a11y_audit_webpage(url="https://dashboard.jukesdiner.com/dashboard/marketing")
```

- [ ] **Image alt text**
  - All campaign images have descriptive alt text
  - Decorative images use alt=""

- [ ] **Status badges**
  - Not color-only (include icon or text)
  - "Active" badge has checkmark icon + green color

### Motion Quality
- [ ] **Modal slide-in <300ms**
  - Campaign details modal slides from right
  - ease-out curve, no bounce

- [ ] **Image gallery transitions smooth**
  - Fade between images: 250ms
  - No white flash between transitions

### Regression Risk
- [ ] **Media uploads functional**
  - Test: Upload PNG, JPG, WebP
  - Expected: All formats accepted, preview renders

- [ ] **Campaign status changes persist**
  - Test: Pause a campaign, reload page
  - Expected: Status still "Paused"

---

## /dashboard/kanban

### Mobile Tap Flows
- [ ] **Task cards draggable on touch**
  - Long-press card to initiate drag
  - Drop zones highlight on drag

- [ ] **Column headers tappable**
  - Tap "To Do" / "In Progress" / "Done"
  - Expands/collapses column (if collapsible)

- [ ] **"Add Task" button accessible**
  - Bottom-right FAB on mobile
  - Min 56x56px touch target

### Visual Hierarchy & Spacing
- [ ] **Column separation clear**
  - Vertical dividers or background color diff
  - 16px gap between columns

- [ ] **Task priority indicated**
  - High priority: Red left border
  - Normal: Gray border
  - Low: Blue border

### Empty/Loading/Error States
- [ ] **Empty column state**
  - "No tasks in 'Done'" message
  - Subtle dashed border on drop zone

- [ ] **Loading tasks**
  - Skeleton cards appear <200ms
  - 3-4 placeholder cards per column

- [ ] **Drag-drop error**
  - If API fails: "Failed to move task" toast
  - Task returns to original position

### Accessibility
```bash
mcp_a11y_audit_webpage(url="https://dashboard.jukesdiner.com/dashboard/kanban")
```

- [ ] **Keyboard-accessible drag-drop**
  - Select card with Enter
  - Move with arrow keys
  - Drop with Enter

- [ ] **Screen reader support**
  - Announces column name when card moves
  - "Task moved from To Do to In Progress"

### Motion Quality
- [ ] **Drag animation smooth**
  - Card follows cursor/finger with <16ms latency
  - No jank during drag

- [ ] **Drop animation natural**
  - Card settles into position with ease-out
  - Other cards shift with 200ms stagger

- [ ] **Column reorder smooth**
  - If columns draggable, animate <300ms

### Regression Risk
- [ ] **Drag-drop works**
  - Test: Move task from "To Do" to "Done"
  - Expected: Task persists in new column after reload

- [ ] **Task edits save**
  - Test: Edit task title inline
  - Expected: Change saved without page reload

---

## Summary Template (After Testing)

### Pass/Fail Summary
- Total tests: X
- Passed: Y
- Failed: Z
- Blocked: A

### Pages Tested
- ✅ /dashboard/financials
- ✅ /dashboard/marketing
- ⚠️  /dashboard/kanban (3 issues found)

### Top 3 Friction Points
1. **Kanban drag-drop on mobile**: Long-press delay too short (300ms), accidental drags common. **Severity: Medium**. Increase to 500ms.

2. **Financials empty state CTA unclear**: "Add Transaction" button not obvious on empty screen. **Severity: Low**. Increase size, add icon.

3. **Marketing modal keyboard trap**: Can't Escape to close, must click X. **Severity: High (accessibility blocker)**. Add Escape key handler.

### Screenshot Evidence
- `/screenshots/financials/empty-state-unclear-cta.png`
- `/screenshots/kanban/drag-drop-mobile-issue.png`
- `/screenshots/marketing/modal-keyboard-trap.png`

### Blocks Operator Use?
- Kanban drag-drop: **No** (workaround: use desktop)
- Financials CTA: **No** (still functional, just not obvious)
- Marketing modal trap: **YES** (keyboard users can't close modal)

---

## Tool Commands Reference

### Browser Automation
```javascript
// Navigate
browser_navigate(url="https://dashboard.jukesdiner.com/dashboard/financials")

// Take snapshot
browser_snapshot()

// Visual inspection
browser_vision(question="Describe the page layout", annotate=true)

// Check console
browser_console()

// Click element
browser_click(ref="@e5")

// Type input
browser_type(ref="@e12", text="test value")

// Scroll
browser_scroll(direction="down")
```

### Accessibility Audit
```javascript
// Full audit
mcp_a11y_audit_webpage(
  url="https://dashboard.jukesdiner.com/dashboard/financials",
  includeHtml=true,
  tags=["wcag2aa", "best-practice"]
)

// Quick summary
mcp_a11y_get_summary(url="https://dashboard.jukesdiner.com/dashboard/financials")
```

### Playwright MCP (if available after config)
```javascript
// Navigate
mcp_playwright_navigate(url="https://dashboard.jukesdiner.com/dashboard/financials")

// Click
mcp_playwright_click(selector="button[data-testid='export-csv']")

// Snapshot
mcp_playwright_snapshot()
```

---

## Notes

- Run checklist on each PR that touches dashboard UI
- Store screenshots in version-controlled directory: `/screenshots/{page}/{issue-id}/`
- Link Kanban cards to specific test failures (e.g., "Fix: Marketing modal keyboard trap" → this checklist item)
- Re-run full suite on major React component refactors
