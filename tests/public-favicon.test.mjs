import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const faviconPath = join(process.cwd(), 'public', 'favicon.ico');

test('public favicon.ico exists as a valid ICO image for browser default requests', async () => {
  const favicon = await readFile(faviconPath);

  assert.equal(favicon.readUInt16LE(0), 0, 'ICO reserved header should be 0');
  assert.equal(favicon.readUInt16LE(2), 1, 'ICO type should identify an icon resource');
  assert.ok(favicon.readUInt16LE(4) >= 1, 'ICO should contain at least one image');
  assert.ok(favicon.length > 100, 'favicon should include actual icon image data');
});

test('root layout metadata declares the browser favicon path', async () => {
  const layoutSource = await readFile(join(process.cwd(), 'app', 'layout.tsx'), 'utf8');

  assert.match(layoutSource, /icons:\s*{[\s\S]*icon:\s*['"]\/favicon\.ico['"]/);
});
