# Mobile Hamburger Menu - Manual Testing Guide

## Quick Verification Steps

### 1. Desktop View (≥768px)
Open dashboard at desktop width:
```bash
cd /Users/lexi/projects/jukes-diner-website
npm run dev
# Visit http://localhost:3000/dashboard
```

**Expected behavior:**
- ✅ Sidebar visible on left (256px width)
- ✅ No hamburger button visible
- ✅ Main content has left margin (256px)
- ✅ All navigation items clickable
- ✅ Current page highlighted in red

### 2. Mobile View (320px, 375px, 480px)
Use Chrome DevTools:
1. Open DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select "iPhone SE" (375×667) or custom 320px width

**Expected behavior:**
- ✅ Sidebar completely hidden
- ✅ Hamburger button visible top-left (44×44px black circle)
- ✅ Main content full-width (no left margin)
- ✅ Click hamburger → drawer slides in from left
- ✅ Backdrop dims content (semi-transparent black)
- ✅ Close button (X) visible top-right of drawer
- ✅ All navigation items present in drawer
- ✅ Current page highlighted in red
- ✅ User profile at bottom of drawer
- ✅ Click backdrop → drawer closes
- ✅ Press Escape → drawer closes
- ✅ Click navigation item → drawer closes, navigates to page

### 3. Tablet View (768px - 1023px)
Use Chrome DevTools:
1. Set width to 768px or select "iPad Mini"

**Expected behavior:**
- ✅ Uses desktop sidebar (persistent, no hamburger)
- ✅ Sidebar visible, all items accessible
- ✅ Main content has left margin

## Touch Target Verification
**Test with Chrome DevTools touch mode:**
1. Enable touch simulation in DevTools
2. Verify hamburger button is easy to tap (44×44px minimum)
3. Verify close button is easy to tap (44×44px minimum)
4. Verify navigation items are easy to tap

## Accessibility Testing

### Keyboard Navigation
**Test sequence:**
1. Load dashboard on mobile view (375px)
2. Press Tab → hamburger button should receive focus
3. Press Enter → drawer should open
4. Press Escape → drawer should close
5. Verify focus returns to hamburger button

### Screen Reader Testing
**VoiceOver (macOS):**
1. Enable VoiceOver (Cmd+F5)
2. Navigate to hamburger button
3. Verify announces "Open navigation menu"
4. Activate button
5. Verify announces drawer state change
6. Navigate to close button
7. Verify announces "Close navigation menu"

## Animation Smoothness
**Test on slower devices:**
1. Use Chrome DevTools CPU throttling (6× slowdown)
2. Open drawer → should slide smoothly (no jank)
3. Close drawer → should slide smoothly
4. Backdrop fade → should be smooth

## Edge Cases to Test

### Rapid clicking
- Click hamburger rapidly → should open/close cleanly
- Click backdrop while drawer is animating → should handle gracefully

### Window resize
1. Open dashboard on mobile (375px)
2. Open drawer
3. Resize window to desktop (1024px)
4. Verify drawer is hidden
5. Verify desktop sidebar appears
6. Resize back to mobile
7. Verify hamburger appears, sidebar hidden

### Navigation while drawer open
1. Open drawer on mobile
2. Click navigation item
3. Verify drawer closes
4. Verify page navigates correctly
5. Verify current page is highlighted in drawer on next open

### Body scroll lock
1. Open drawer on mobile
2. Try to scroll page content behind drawer
3. Verify scrolling is disabled
4. Close drawer
5. Verify scrolling is re-enabled

## Performance Checks

### Memory leaks
1. Open/close drawer 20 times rapidly
2. Open Chrome DevTools → Performance → Memory
3. Take heap snapshot
4. Verify no detached DOM nodes
5. Verify event listeners are cleaned up

### Render performance
1. Open Chrome DevTools → Performance
2. Start recording
3. Open drawer
4. Stop recording
5. Verify no long tasks (>50ms)
6. Verify smooth 60fps animation

## Browser Compatibility

### Minimum testing matrix:
- ✅ Chrome (Desktop + Mobile DevTools)
- ✅ Safari (macOS + iOS Simulator)
- ✅ Firefox (Desktop + Responsive Design Mode)
- ⚠️ Real devices:
  - iPhone SE (320px)
  - iPhone 14 Pro (375px)
  - iPad Mini (768px)
  - Android phone (360px, 412px)

## Bug Report Template

If issues found, report with:
```
**Browser:** Chrome 131 / Safari 18 / Firefox 133
**Device:** iPhone SE / Desktop DevTools
**Screen width:** 375px
**Steps to reproduce:**
1. 
2. 
3. 

**Expected:**
...

**Actual:**
...

**Screenshot/Video:**
[attach]
```

## Success Criteria Checklist

Before marking as production-ready:
- [ ] Hamburger visible on mobile (<768px)
- [ ] Drawer slides in smoothly (300ms)
- [ ] Backdrop overlays content
- [ ] Close button works
- [ ] Escape key closes drawer
- [ ] Backdrop click closes drawer
- [ ] Main content full-width on mobile
- [ ] All navigation items present
- [ ] Current page highlighted
- [ ] User profile + logout visible
- [ ] Desktop sidebar unaffected (≥768px)
- [ ] No horizontal scroll on any viewport
- [ ] Touch targets adequate (≥44px)
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] VoiceOver announces correctly
- [ ] Smooth animation (no jank)
- [ ] No layout shift on open/close

## Next Steps

After manual verification:
1. ✅ Test on real iOS device (Safari)
2. ✅ Test on real Android device (Chrome)
3. ✅ Collect user feedback
4. 🚀 Deploy to production
5. 📊 Monitor analytics (mobile engagement)

## Rollback Plan

If critical issues found:
```bash
cd /Users/lexi/projects/jukes-diner-website
git log --oneline | head -5  # Find commit before mobile menu
git revert <commit-hash>
npm run build
# Deploy rollback
```

Single file revert:
```bash
git checkout HEAD~1 -- components/dashboard-layout.jsx
```

## Contact

Issues or questions:
- Kanban task: t_2e4b70db
- Implementation doc: MOBILE_HAMBURGER_MENU_IMPLEMENTATION.md
- Tests: tests/mobile-hamburger-menu.test.mjs
