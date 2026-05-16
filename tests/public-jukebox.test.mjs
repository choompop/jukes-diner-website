import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function readProjectFile(relativePath) {
  const fullPath = join(projectRoot, relativePath);
  assert.ok(existsSync(fullPath), `${relativePath} should exist`);
  return readFileSync(fullPath, 'utf-8');
}

test('root layout renders the global retro jukebox widget on public pages', () => {
  const layout = readProjectFile('app/layout.tsx');

  assert.match(layout, /import\s+Jukebox\s+from\s+['"]\.\/components\/Jukebox['"]/, 'Root layout should import the Jukebox component');
  assert.match(layout, /<Jukebox\s*\/\>/, 'Root layout should render the global Jukebox widget once');
});

test('jukebox has a fixed bottom-right button and an expandable diner-style interface', () => {
  const component = readProjectFile('app/components/Jukebox.tsx');

  assert.match(component, /['"]use client['"]/, 'Jukebox must be client-side because browser audio requires a user gesture');
  assert.match(component, /aria-label=\{isPlaying \? 'Pause jukebox' : 'Open jukebox'\}/, 'Floating button should have an accessible play/pause label');
  assert.match(component, /fixed\s+inset-0[\s\S]*absolute\s+bottom-5\s+right-5|absolute\s+bottom-5\s+right-5[\s\S]*fixed\s+inset-0|fixed\s+bottom-5\s+right-5|fixed[^"']*right-5[^"']*bottom-5/, 'Jukebox button should stay fixed at the bottom-right of the viewport');
  assert.match(component, /role="dialog"/, 'Expanded jukebox interface should be announced as a dialog');
  assert.match(component, /Now spinning/i, 'Expanded interface should show the current song');
});

test('jukebox playlist uses browser-generated retro instrumentals instead of copyrighted embedded songs', () => {
  const component = readProjectFile('app/components/Jukebox.tsx');

  assert.match(component, /const\s+PLAYLIST\s*=\s*\[/, 'Jukebox should define a visible playlist');
  const titleMatches = component.match(/title:\s*['"][^'"]+['"]/g) || [];
  assert.ok(titleMatches.length >= 6, 'Jukebox should include a bunch of retro diner-style tracks');
  assert.doesNotMatch(component, /\.mp3|\.wav|\.m4a|spotify|youtube|soundcloud|archive\.org/i, 'Jukebox should not embed third-party or copyrighted audio files');
  assert.match(component, /AudioContext|webkitAudioContext/, 'Jukebox should generate audio through the browser Web Audio API');
  assert.match(component, /oscillator\.type\s*=\s*['"](?:sine|triangle|square)['"]/, 'Generated audio should use simple synth waveforms');
});

test('jukebox animates music notes while music is playing and respects reduced motion', () => {
  const component = readProjectFile('app/components/Jukebox.tsx');
  const css = readProjectFile('app/globals.css');

  assert.match(component, /isPlaying\s*&&[\s\S]*jukebox-note/, 'Music notes should render only while playback is active');
  assert.match(css, /@keyframes\s+jukebox-note-float/, 'CSS should define a floating music-note animation');
  assert.match(css, /\.jukebox-note/, 'CSS should style animated jukebox notes');
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*jukebox-note/, 'Animation should be disabled or softened for reduced-motion users');
});

test('jukebox starts audio from direct user handlers and immediately stops active tones on pause', () => {
  const component = readProjectFile('app/components/Jukebox.tsx');

  assert.match(component, /function\s+beginPlayback\(/, 'Jukebox should have a direct playback starter called from click handlers');
  assert.match(component, /function\s+togglePlayback\([\s\S]*beginPlayback\(trackIndex\)/, 'Main button handler should start audio directly during the user gesture');
  assert.match(component, /function\s+selectTrack\([\s\S]*beginPlayback\(index\)/, 'Track buttons should start audio directly during the user gesture');
  assert.match(component, /activeOscillatorsRef/, 'Jukebox should track active oscillator nodes');
  assert.match(component, /activeOscillatorsRef\.current\.forEach\(\(oscillator\) => oscillator\.stop\(\)\)/, 'Pause should stop active oscillators immediately, not only clear future intervals');
  assert.doesNotMatch(component, /useEffect\(\(\) => \{[\s\S]*startLoop\(currentTrack\)/, 'Playback should not depend on a post-click React effect that can lose browser user activation');
});
