import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/**
 * Media Approvals UI Enhancement QA Test Suite
 * 
 * Verifies implementation from t_2c1b82e9:
 * - Media-type-specific icons (Video/Image from lucide-react)
 * - 40x40px icon containers with semantic background colors
 * - Pink (bg-pink-100/text-pink-600) for video items
 * - Purple (bg-purple-100/text-purple-600) for image items
 * - Larger readable badges (size="md" instead of size="sm")
 * - Proper StatusBadge variants ('video' and 'image')
 * - Accessibility & responsive compliance
 */

let commandCenterPageContent;
let statusBadgeContent;

// Load files once for all tests
test.before(async () => {
  commandCenterPageContent = await readFile(
    'app/dashboard/command-center/page.tsx',
    'utf-8'
  );
  statusBadgeContent = await readFile(
    'components/StatusBadge.tsx',
    'utf-8'
  );
});

// === ICON IMPLEMENTATION ===

test('Media Approvals section imports Video and ImageIcon from lucide-react', () => {
  assert.match(
    commandCenterPageContent,
    /import.*\{[^}]*Video[^}]*\}.*from ['"]lucide-react['"]/,
    'Should import Video icon from lucide-react'
  );
  assert.match(
    commandCenterPageContent,
    /Image as ImageIcon/,
    'Should import Image as ImageIcon from lucide-react'
  );
});

test('Media Approvals uses conditional media-type-specific icon logic', () => {
  // Check for dynamic icon selection based on item.type
  assert.match(
    commandCenterPageContent,
    /const MediaIcon = item\.type === ['"]video['"] \? Video : ImageIcon/,
    'Should conditionally select Video or ImageIcon based on item.type'
  );
});

test('Media Approvals section has 40x40px icon container with flex-shrink-0', () => {
  // Check for w-10 h-10 (40px x 40px) with flex-shrink-0 to prevent icon squashing
  assert.match(
    commandCenterPageContent,
    /w-10 h-10.*flex.*items-center justify-center.*flex-shrink-0/s,
    'Icon container should be 40x40px (w-10 h-10) with flex-shrink-0'
  );
});

test('Media Approvals icon containers use rounded corners', () => {
  assert.match(
    commandCenterPageContent,
    /w-10 h-10 rounded-lg/,
    'Icon containers should use rounded-lg for subtle rounded corners'
  );
});

// === SEMANTIC COLOR IMPLEMENTATION ===

test('Video items use pink semantic colors (bg-pink-100 / text-pink-600)', () => {
  assert.match(
    commandCenterPageContent,
    /item\.type === ['"]video['"][\s\S]*?['"]bg-pink-100['"]/,
    'Video items should use bg-pink-100 background'
  );
  assert.match(
    commandCenterPageContent,
    /item\.type === ['"]video['"][\s\S]*?['"]text-pink-600['"]/,
    'Video items should use text-pink-600 icon color'
  );
});

test('Image items use purple semantic colors (bg-purple-100 / text-purple-600)', () => {
  assert.match(
    commandCenterPageContent,
    /['"]bg-purple-100['"]/,
    'Image items should use bg-purple-100 background'
  );
  assert.match(
    commandCenterPageContent,
    /['"]text-purple-600['"]/,
    'Image items should use text-purple-600 icon color'
  );
});

test('Color selection is conditional based on item.type', () => {
  // Verify dynamic color assignment
  assert.match(
    commandCenterPageContent,
    /const iconBgColor = item\.type === ['"]video['"][\s\S]{0,50}['"]bg-pink-100['"][\s\S]{0,50}:[\s\S]{0,50}['"]bg-purple-100['"]/,
    'Background color should be conditionally assigned based on item.type'
  );
  assert.match(
    commandCenterPageContent,
    /const iconColor = item\.type === ['"]video['"][\s\S]{0,50}['"]text-pink-600['"][\s\S]{0,50}:[\s\S]{0,50}['"]text-purple-600['"]/,
    'Icon color should be conditionally assigned based on item.type'
  );
});

// === BADGE SIZE UPGRADE ===

test('StatusBadge component supports "md" size variant', () => {
  assert.match(
    statusBadgeContent,
    /export type BadgeSize = ['"]sm['"] \| ['"]md['"] \| ['"]lg['"]/,
    'StatusBadge should export BadgeSize type with md variant'
  );
  assert.match(
    statusBadgeContent,
    /md: ['"]px-3 py-1 text-\[10px\] rounded-full['"]/,
    'md size should be defined with proper padding and font size'
  );
});

test('Media Approvals uses size="md" badges for readability', () => {
  // Find StatusBadge in Media Approvals section and verify size="md"
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?<\/div>\s*<\/div>\s*\n\s*{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /size=["']md["']/,
    'Media Approvals should use size="md" for badges'
  );
});

test('StatusBadge size defaults to "md" when not specified', () => {
  assert.match(
    statusBadgeContent,
    /size = ['"]md['"]/,
    'StatusBadge should default to md size'
  );
});

// === STATUSBADGE VARIANTS ===

test('StatusBadge component defines video and image variants', () => {
  assert.match(
    statusBadgeContent,
    /['"]image['"]/,
    'StatusBadge should have image variant'
  );
  assert.match(
    statusBadgeContent,
    /['"]video['"]/,
    'StatusBadge should have video variant'
  );
});

test('StatusBadge video variant uses pink colors matching icon container', () => {
  assert.match(
    statusBadgeContent,
    /video:.*bg-pink-100 text-pink-700/,
    'video variant should use bg-pink-100 text-pink-700'
  );
});

test('StatusBadge image variant uses purple colors matching icon container', () => {
  assert.match(
    statusBadgeContent,
    /image:.*bg-purple-100 text-purple-700/,
    'image variant should use bg-purple-100 text-purple-700'
  );
});

test('Media Approvals uses correct StatusBadge variants', () => {
  // Check that badges use variant based on item.type
  assert.match(
    commandCenterPageContent,
    /variant=\{item\.type === ['"]video['"] \? ['"]video['"] : ['"]image['"]\}/,
    'Should use video or image variant based on item.type'
  );
});

// === LAYOUT & STRUCTURE ===

test('Media Approvals items use flex layout with icon on left, content on right', () => {
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /flex gap-3/,
    'Should use flex layout with gap-3 between icon and content'
  );
});

test('Media Approvals content area uses flex-grow and min-w-0 for text truncation', () => {
  assert.match(
    commandCenterPageContent,
    /flex-grow min-w-0/,
    'Content area should use flex-grow min-w-0 for proper text wrapping/truncation'
  );
});

// === ACCESSIBILITY ===

test('Media type icons have appropriate size for visibility (h-5 w-5)', () => {
  // Icons inside the 40x40px container should be h-5 w-5 (20px)
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /<MediaIcon className=["']h-5 w-5["']/,
    'MediaIcon should be h-5 w-5 (20px) for visibility'
  );
});

test('StatusBadge uses uppercase and tracking for readability', () => {
  assert.match(
    statusBadgeContent,
    /uppercase tracking-widest/,
    'Badges should use uppercase and letter spacing for readability'
  );
});

test('Media Approvals maintains COMPACT_LIST pattern for consistent spacing', () => {
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /CARD_PATTERNS\.COMPACT_LIST/,
    'Should use CARD_PATTERNS.COMPACT_LIST for consistent sidebar spacing'
  );
});

// === VISUAL HIERARCHY ===

test('Media Approvals title maintains proper font hierarchy', () => {
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /text-xs font-medium/,
    'Item titles should use text-xs font-medium for hierarchy'
  );
});

test('Media Approvals submitter info uses muted text color', () => {
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /text-gray-500/,
    'Submitter info should use text-gray-500 for de-emphasis'
  );
});

// === REGRESSION CHECKS ===

test('Media Approvals section maintains motion animation for items', () => {
  assert.match(
    commandCenterPageContent,
    /mediaApprovals\.map\(\(item, idx\) => \{[\s\S]*?<motion\.div/,
    'Items should use framer-motion for staggered entrance animation'
  );
  assert.match(
    commandCenterPageContent,
    /transition=\{shouldReduceMotion \? \{ duration: 0 \} : \{ delay: idx \* 0\.05 \}\}/,
    'Should use staggered delay based on index'
  );
});

test('Media Approvals maintains unique key prop for list items', () => {
  assert.match(
    commandCenterPageContent,
    /key=\{item\.id\}/,
    'Each item should have unique key based on item.id'
  );
});

test('Media Approvals section header maintains purple icon color', () => {
  // Section header should still use purple as the primary color
  const sectionHeader = commandCenterPageContent.match(
    /<ImageIcon className=["']h-5 w-5 text-purple-600["']/
  );
  
  assert.ok(sectionHeader, 'Section header icon should use text-purple-600');
});

test('No regression in existing data structure requirements', () => {
  // Items should still have all required fields
  const mediaApprovalsSection = commandCenterPageContent.match(
    /\/\* Media Approvals \*\/[\s\S]*?{\/\* Financial Pulse \*\//
  );
  
  assert.ok(mediaApprovalsSection, 'Should find Media Approvals section');
  assert.match(
    mediaApprovalsSection[0],
    /item\.title/,
    'Should access item.title'
  );
  assert.match(
    mediaApprovalsSection[0],
    /item\.type/,
    'Should access item.type'
  );
  assert.match(
    mediaApprovalsSection[0],
    /item\.submittedBy/,
    'Should access item.submittedBy'
  );
});
