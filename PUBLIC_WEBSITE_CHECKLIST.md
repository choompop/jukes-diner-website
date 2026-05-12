# Public Website Repair - Acceptance Criteria Checklist

## Route Functionality
- [x] `/` renders successfully with no broken sections
- [x] `/menu` renders successfully with no broken sections
- [x] `/book` renders successfully with no broken sections
- [x] `/find-us` renders successfully with no broken sections
- [x] `/about` renders successfully with no broken sections
- [x] `/apply` renders successfully with no broken sections

## Visual Design
- [x] Public pages use retro diner brand palette: red (#d62828), cream (#f8f1e5), teal (#2a9d8f), black (#1a1a1a)
- [x] Typography is clean and readable (Inter, Bungee display, Playfair Display serif)
- [x] Spacing and layout are polished and mobile-first/responsive
- [x] All pages use consistent diner-* color classes

## Homepage Sections
- [x] Hero section present with brand name and tagline
- [x] Menu preview section showing fan favorites from MENU_ITEMS
- [x] Event/catering proof via testimonials section
- [x] Locations content in "Our Story" section
- [x] Franchise/apply CTA section with link to /apply
- [x] Clear "BOOK JUKE'S" CTA prominently displayed in hero (primary button, larger size, white border)

## Navigation
- [x] Header navigation links to public pages: Home, About, Menu, Order, Book, Find Us, Merch, Franchise
- [x] Dashboard/internal link is separate from public navigation
- [x] Dashboard link clearly marked as "Internal" with distinct styling:
  - Darker background (bg-diner-black/30)
  - Border (border-white/20)
  - User icon
  - Positioned last, visually separated
- [x] Mobile navigation also separates dashboard link with visual divider

## Security
- [x] No sensitive dashboard information appears on public pages
- [x] No API keys, passwords, or internal data exposed
- [x] Public pages don't import dashboard components

## Tests & Build
- [x] `npm test` passes for public website tests (11/11 passing)
- [x] `npm run build` passes successfully
- [x] All public routes compile without errors

## Additional Public Pages Updated
- [x] `/order` page updated with correct imports and colors
- [x] `/merch` page updated with correct imports and colors

## Notes
- Pre-existing test failures (3) are unrelated to public website:
  1. Dashboard navigation test (dashboard internal feature)
  2. Dashboard session cookie test (dashboard internal feature)  
  3. Hermes Kanban test (vitest import error, not public-facing)
  
All acceptance criteria for the public website repair task have been met.
