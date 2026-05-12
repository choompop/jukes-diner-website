import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dashboardLayoutPath = path.join(repoRoot, 'app/dashboard/components/DashboardLayout.tsx');
const appDir = path.join(repoRoot, 'app');

function walkPageFiles(dir, pages = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPageFiles(fullPath, pages);
    } else if (entry.isFile() && /^page\.(js|jsx|ts|tsx|mdx)$/.test(entry.name)) {
      pages.push(fullPath);
    }
  }

  return pages;
}

function routeFromPageFile(pageFile) {
  const relativeDir = path.relative(appDir, path.dirname(pageFile));
  if (!relativeDir) return '/';
  return `/${relativeDir.split(path.sep).join('/')}`;
}

function dashboardNavPaths() {
  const layout = readFileSync(dashboardLayoutPath, 'utf8');
  const navGroupsMatch = layout.match(/const navGroups = \[[\s\S]*?\n  \];/);
  assert.ok(navGroupsMatch, 'DashboardLayout should define navGroups for sidebar links');

  return [...navGroupsMatch[0].matchAll(/path:\s*'([^']+)'/g)]
    .map((match) => match[1])
    .filter((route) => route.startsWith('/'));
}

function explicitRedirectTargets() {
  const nextConfigPath = path.join(repoRoot, 'next.config.js');
  const redirects = new Set();

  if (existsSync(nextConfigPath)) {
    const config = readFileSync(nextConfigPath, 'utf8');
    for (const match of config.matchAll(/source:\s*['"]([^'"]+)['"][\s\S]*?destination:\s*['"]([^'"]+)['"]/g)) {
      redirects.add(match[1]);
      redirects.add(match[2]);
    }
  }

  return redirects;
}

test('every DashboardLayout sidebar path resolves to an app page route or explicit redirect', () => {
  const existingPageRoutes = new Set(walkPageFiles(appDir).map(routeFromPageFile));
  const redirects = explicitRedirectTargets();
  const missingRoutes = dashboardNavPaths().filter(
    (route) => !existingPageRoutes.has(route) && !redirects.has(route),
  );

  assert.deepEqual(missingRoutes, [], `Missing dashboard sidebar routes: ${missingRoutes.join(', ')}`);
});
