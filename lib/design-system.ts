/**
 * Juke's Diner Design System - Spacing Scale
 * 
 * Standardized spacing values for consistent visual rhythm across the dashboard.
 * Use these constants for all card spacing, section gaps, and component padding.
 */

export const SPACING = {
  // Internal component spacing
  TIGHT: 'gap-1 space-y-1',        // 4px  - tight (within components)
  CLOSE: 'gap-2 space-y-2',        // 8px  - close (related items)
  
  // Card spacing (PRIMARY USE CASE)
  CARD_GAP: 'gap-4 space-y-4',     // 16px - default card spacing
  CARD_PADDING: 'p-4',             // 16px - internal card padding
  
  // Section spacing
  SECTION: 'gap-6 space-y-6',      // 24px - section spacing
  MAJOR: 'gap-8 space-y-8',        // 32px - major section breaks
} as const;

/**
 * Card List Component Classes
 * 
 * Standardized class combinations for different card list patterns.
 */
export const CARD_PATTERNS = {
  // Divider pattern - for lists with horizontal dividers between items
  LIST_WITH_DIVIDERS: {
    container: 'divide-y divide-gray-50',
    item: 'p-4 hover:bg-gray-50 transition-colors',
  },
  
  // Spaced pattern - for lists with visible gaps and backgrounds
  LIST_WITH_SPACING: {
    container: 'space-y-4 p-4',
    item: 'p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors',
  },
  
  // Compact pattern - for sidebar widgets
  COMPACT_LIST: {
    container: 'space-y-3 p-4',
    item: 'p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors',
  },
} as const;

/**
 * Badge System
 * 
 * Standardized badge variants for consistent visual hierarchy.
 * Import from @/components/StatusBadge for all status, priority, and category labels.
 */
export const BADGE_VARIANTS = {
  // Priority levels (urgent → high → medium → low)
  PRIORITY: ['urgent', 'high', 'medium', 'low'],
  
  // Booking status
  BOOKING: ['booking', 'lead'],
  
  // SOP categories
  SOP: ['daily-ops', 'emergency'],
  
  // Media types
  MEDIA: ['image', 'video'],
  
  // Generic semantic states
  SEMANTIC: ['success', 'warning', 'error', 'info', 'neutral'],
} as const;

/**
 * Usage Guidelines:
 * 
 * 1. For main content card lists (TODAY'S PRIORITIES, BOOKINGS, etc.):
 *    Use CARD_PATTERNS.LIST_WITH_DIVIDERS
 * 
 * 2. For sidebar widgets (MEDIA APPROVALS, etc.):
 *    Use CARD_PATTERNS.COMPACT_LIST
 * 
 * 3. For spaced cards with individual backgrounds:
 *    Use CARD_PATTERNS.LIST_WITH_SPACING
 * 
 * 4. Between major sections on a page:
 *    Use SPACING.MAJOR (space-y-8)
 * 
 * 5. Between related sections:
 *    Use SPACING.SECTION (space-y-6)
 * 
 * 6. For status, priority, and category labels:
 *    Use <StatusBadge variant="..." /> from @/components/StatusBadge
 *    - All badges use same border-radius (rounded-full)
 *    - All badges use same font-size per size variant (sm/md/lg)
 *    - Semantic colors maintained (urgent=red, booking=green, etc.)
 */
