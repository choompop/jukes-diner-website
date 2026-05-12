# MetricCard Accessibility: Aria Labels Implementation

## Summary
Added aria-label support to MetricCard component links for improved screen reader accessibility.

## Changes Made

### 1. MetricCard Component (`components/MetricCard.tsx`)
- Added optional `ariaLabel?: string` prop to MetricCardProps interface
- Applied aria-label to Link element with fallback: `aria-label={ariaLabel || \`View ${label}\`}`
- When linkTo is provided but no ariaLabel is specified, falls back to "View [Label]"

### 2. Command Center Page (`app/dashboard/command-center/page.tsx`)
Updated all 4 MetricCard instances with linkTo to include descriptive aria-labels:

| Card | aria-label |
|------|-----------|
| Urgent Tasks | "View today's urgent tasks and priorities" |
| Today Bookings | "Go to today's bookings and leads" |
| Open Issues | "View open operations issues" |
| Media Approvals | "View pending media approvals" |

The 5th MetricCard (Nashville weather) has no linkTo, so no aria-label is needed.

### 3. Test Coverage (`tests/metric-card-aria-labels.test.mjs`)
Created comprehensive test suite with 8 tests:
- ✅ MetricCard component accepts ariaLabel prop
- ✅ MetricCard applies aria-label to Link with fallback
- ✅ All MetricCard instances with linkTo have descriptive aria-labels
- ✅ Urgent Tasks MetricCard has descriptive aria-label
- ✅ Today Bookings MetricCard has descriptive aria-label
- ✅ Open Issues MetricCard has descriptive aria-label
- ✅ Media Approvals MetricCard has descriptive aria-label
- ✅ Weather MetricCard without link has no aria-label requirement

## Screen Reader Experience

**Before:** Screen readers announced links as just "link" with no context.

**After:** Screen readers announce:
- "View today's urgent tasks and priorities, link"
- "Go to today's bookings and leads, link"
- "View open operations issues, link"
- "View pending media approvals, link"

## Verification

- All 8 new accessibility tests pass
- Build completes successfully with no errors
- No regressions in existing functionality
- Implementation follows established accessibility patterns

## Files Modified
1. `/components/MetricCard.tsx` - Component implementation
2. `/app/dashboard/command-center/page.tsx` - Usage with aria-labels
3. `/tests/metric-card-aria-labels.test.mjs` - Test coverage (new file)
