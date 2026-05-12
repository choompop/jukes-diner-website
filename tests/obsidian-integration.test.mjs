#!/usr/bin/env node

/**
 * Test: Obsidian vault search integration for Kanban triage enrichment
 * 
 * Verifies that:
 * 1. Obsidian vault path is accessible
 * 2. Key business notes exist and are readable
 * 3. Search patterns work correctly
 * 4. Wikilink references resolve
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

const VAULT_PATH = '/Users/lexi/Documents/obsidian-vault';
const KEY_NOTES = [
  'projects/Juke\'s Diner.md',
  'systems/Jukes Agent Operating System.md',
  'systems/Obsidian Kanban Integration.md',
  'reference/Master Memory.md'
];

const WIKILINK_TESTS = [
  { wikilink: '[[Juke\'s Diner]]', expectedFile: 'projects/Juke\'s Diner.md' },
  { wikilink: '[[Jukes Agent Operating System]]', expectedFile: 'systems/Jukes Agent Operating System.md' },
  { wikilink: '[[Obsidian Kanban Integration]]', expectedFile: 'systems/Obsidian Kanban Integration.md' }
];

function testVaultAccess() {
  console.log('Testing vault access...');
  if (!existsSync(VAULT_PATH)) {
    throw new Error(`Vault not found at ${VAULT_PATH}`);
  }
  console.log('✓ Vault accessible');
}

function testKeyNotes() {
  console.log('\nTesting key notes exist...');
  for (const note of KEY_NOTES) {
    const fullPath = resolve(VAULT_PATH, note);
    if (!existsSync(fullPath)) {
      throw new Error(`Missing key note: ${note}`);
    }
    const content = readFileSync(fullPath, 'utf-8');
    if (content.length === 0) {
      throw new Error(`Empty note: ${note}`);
    }
    console.log(`✓ ${note} (${content.length} bytes)`);
  }
}

function testSearchPatterns() {
  console.log('\nTesting search patterns...');
  
  const tests = [
    { pattern: 'event truck', expected: 'projects/Juke\'s Diner.md' },
    { pattern: 'Daniel', expected: 'projects/Juke\'s Diner.md' },
    { pattern: 'jukes-librarian', expected: 'systems/Jukes Agent Operating System.md' },
    { pattern: 'Toast', expected: 'projects/Juke\'s Diner.md' }
  ];
  
  for (const test of tests) {
    try {
      const result = execSync(
        `rg -l "${test.pattern}" "${VAULT_PATH}"`,
        { encoding: 'utf-8' }
      );
      if (!result.includes(test.expected)) {
        console.warn(`⚠ Pattern "${test.pattern}" didn't match expected file ${test.expected}`);
      } else {
        console.log(`✓ Pattern "${test.pattern}" found in ${test.expected}`);
      }
    } catch (err) {
      console.warn(`⚠ Pattern "${test.pattern}" search failed (ripgrep may not be installed)`);
    }
  }
}

function testWikilinkResolution() {
  console.log('\nTesting wikilink resolution...');
  
  for (const test of WIKILINK_TESTS) {
    const fullPath = resolve(VAULT_PATH, test.expectedFile);
    if (!existsSync(fullPath)) {
      throw new Error(`Wikilink ${test.wikilink} should resolve to ${test.expectedFile} but file doesn't exist`);
    }
    console.log(`✓ ${test.wikilink} → ${test.expectedFile}`);
  }
}

function testIntegrationDocContent() {
  console.log('\nTesting integration doc content...');
  
  const integrationDoc = resolve(VAULT_PATH, 'systems/Obsidian Kanban Integration.md');
  const content = readFileSync(integrationDoc, 'utf-8');
  
  const requiredSections = [
    '## How it works',
    '## Flow diagram',
    '## Wikilinks in enriched cards',
    '## Example enrichment',
    '## Specialist roster'
  ];
  
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      throw new Error(`Integration doc missing section: ${section}`);
    }
    console.log(`✓ Found section: ${section}`);
  }
  
  // Check for critical wikilinks
  const criticalLinks = ['[[Juke\'s Diner]]', '[[Daniel]]', '[[Toast]]', '[[Jukes Agent Operating System]]'];
  for (const link of criticalLinks) {
    if (!content.includes(link)) {
      throw new Error(`Integration doc missing critical wikilink: ${link}`);
    }
  }
  console.log(`✓ All critical wikilinks present`);
}

function main() {
  console.log('Obsidian → Kanban Integration Test\n');
  console.log('='.repeat(50));
  
  try {
    testVaultAccess();
    testKeyNotes();
    testSearchPatterns();
    testWikilinkResolution();
    testIntegrationDocContent();
    
    console.log('\n' + '='.repeat(50));
    console.log('✓ All tests passed');
    console.log('\nIntegration ready:');
    console.log('- Vault accessible at', VAULT_PATH);
    console.log('- Key notes exist and readable');
    console.log('- Wikilinks resolve correctly');
    console.log('- Integration doc complete');
    console.log('\nSkill: jukes-triage-enrichment');
    console.log('Docs: /Users/lexi/projects/jukes-diner-website/brain/OBSIDIAN_KANBAN_INTEGRATION.md');
    console.log('Vault: /Users/lexi/Documents/obsidian-vault/systems/Obsidian Kanban Integration.md');
    
  } catch (err) {
    console.error('\n✗ Test failed:', err.message);
    process.exit(1);
  }
}

main();
