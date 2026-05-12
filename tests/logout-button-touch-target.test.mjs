import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('LOGOUT button has WCAG 2.5.5 AAA compliant touch target (py-4 for 48px height)', async () => {
  const layoutSource = await readFile(
    'app/dashboard/components/DashboardLayout.tsx',
    'utf-8'
  );

  // Verify LOGOUT button exists with proper structure
  assert.match(
    layoutSource,
    /className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-gray-400 hover:bg-red-500\/10 hover:text-red-500 transition-all"/,
    'LOGOUT button should have py-4 (16px padding) for 48px minimum height to meet WCAG 2.5.5 Level AAA'
  );

  // Verify the button is associated with logout functionality
  assert.match(
    layoutSource,
    /async function handleLogout\(\)[\s\S]*fetch\(['"]\/api\/auth['"],[\s\S]*method:\s*['"]DELETE['"][\s\S]*localStorage\.removeItem\(['"]jukes_user['"]\)/,
    'LOGOUT handler should call /api/auth DELETE and clear jukes_user from localStorage'
  );
  assert.match(
    layoutSource,
    /onClick=\{handleLogout\}/,
    'LOGOUT button should call the logout handler'
  );

  // Verify button contains logout text
  assert.match(
    layoutSource,
    /<span[^>]*>Logout<\/span>/,
    'LOGOUT button should contain Logout text'
  );

  // Verify LogOut icon is present
  assert.match(
    layoutSource,
    /<LogOut[^>]*\/>/,
    'LOGOUT button should include LogOut icon'
  );

  // Ensure py-3 is NOT used (old non-compliant padding)
  const logoutButtonMatch = layoutSource.match(
    /onClick=\{handleLogout\}[\s\S]*?className="[^"]*"/
  );
  
  if (logoutButtonMatch) {
    assert.doesNotMatch(
      logoutButtonMatch[0],
      /py-3(?!\d)/,
      'LOGOUT button should NOT use py-3 (old 40px height, WCAG non-compliant)'
    );
  }
});
