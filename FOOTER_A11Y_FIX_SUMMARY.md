# Footer Social Media Links A11Y Fix - Task t_bd634dd0

## Summary
Fixed WCAG compliance issue where footer social media icon-only links had no accessible text for screen readers.

## Problem
The footer contained 3 social media links (Instagram, Twitter, Website) with only icon content and no accessible names. Screen readers would announce these as "link" with no indication of purpose or destination, violating WCAG's link-name requirement (serious impact).

## Solution
Added `aria-label` attributes to each social media link:
- Instagram (Camera icon): `aria-label="Follow us on Instagram"`
- Twitter (MessageCircle icon): `aria-label="Follow us on Twitter"`  
- Website (Globe icon): `aria-label="Visit our website"`

## Files Modified
- `app/components/Footer.tsx` - Added aria-label attributes to 3 social media links (lines 18-20)

## Tests
Created comprehensive test suite: `tests/footer-social-links-a11y.test.mjs`
- ✅ All 3 links have aria-label attributes
- ✅ All links have both href and aria-label
- ✅ All aria-labels use descriptive text (not just platform names)

All 3 tests pass.

## WCAG Compliance
This fix resolves:
- 3x `link-name` violations (serious impact) from Axe audit
- Screen readers can now announce the purpose of each link
- Meets WCAG 2.1 Level A requirement for link text/accessible names

## Related
- Source QA task: t_fb7613c7
- Axe audit findings

## Date
2026-05-09
