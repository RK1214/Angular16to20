const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_new4.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_new4.js');
const migrator = new FlexMigrator({ dryRun: false });
fs.unlinkSync(tempPath);

console.log('='.repeat(80));
console.log('Testing issues_new4.txt Fixes');
console.log('='.repeat(80));
console.log('');

const testCases = [
  // ==========================================
  // Issue 1: Duplicate fxLayout attributes
  // ==========================================
  {
    input: '<test-element fxLayout="row" fxLayoutAlign="space-between center" fxLayout="row wrap" fxFlex></test-element>',
    shouldNotContain: ['fxLayout='],
    shouldContain: ['flex-row', 'flex-wrap', 'align-space-between-center', 'flex-1'],
    description: '🔴 Issue 1: Duplicate fxLayout attributes should ALL be removed'
  },

  // Simpler duplicate test
  {
    input: '<div fxLayout="row" fxLayout="column"></div>',
    shouldNotContain: ['fxLayout='],
    shouldContain: ['flex-column'], // Last one wins
    description: '🔴 Issue 1: Duplicate fxLayout (simple case)'
  },

  // Triple duplicate
  {
    input: '<div fxLayout="row" fxLayout="column" fxLayout="row wrap"></div>',
    shouldNotContain: ['fxLayout='],
    shouldContain: ['flex-row', 'flex-wrap'], // Last one wins
    description: '🔴 Issue 1: Triple duplicate fxLayout'
  },

  // ==========================================
  // Issue 2: Single-quoted attributes
  // ==========================================
  {
    input: "<div class='container' fxLayout='row wrap'></div>",
    shouldNotContain: ["fxLayout='"],
    shouldContain: ['flex-row', 'flex-wrap', 'container'],
    description: "🔴 Issue 2: Single-quoted fxLayout='row wrap'"
  },

  // Mixed quotes
  {
    input: '<div fxLayout="row" fxLayoutAlign=\'center center\'></div>',
    shouldNotContain: ['fxLayout=', 'fxLayoutAlign='],
    shouldContain: ['flex-row', 'align-center-center'],
    description: "🔴 Issue 2: Mixed quotes (double and single)"
  },

  // Single quotes with breakpoint
  {
    input: "<div fxLayout.gt-xs='column wrap'></div>",
    shouldNotContain: ["fxLayout.gt-xs='"],
    shouldContain: ['flex-row', 'flex-column-gt-xs', 'flex-wrap-gt-xs'],
    description: "🔴 Issue 2: Single-quoted with breakpoint"
  },

  // All single quotes
  {
    input: "<div fxLayout='row' fxLayoutAlign='center' fxLayoutGap='24px' fxFlex='50'></div>",
    shouldNotContain: ['fxLayout=', 'fxLayoutAlign=', 'fxLayoutGap=', 'fxFlex='],
    shouldContain: ['flex-row', 'align-center-stretch', 'gap-24', 'flex-50'],
    description: "🔴 Issue 2: All single quotes"
  },

  // ==========================================
  // Combined: Duplicate + Single Quotes
  // ==========================================
  {
    input: "<div fxLayout='row' fxLayout=\"column\"></div>",
    shouldNotContain: ['fxLayout='],
    shouldContain: ['flex-column'], // Last one wins (double-quoted)
    description: "🔴 Combined: Duplicate with mixed quotes"
  },

  // ==========================================
  // Regression tests (ensure we didn't break anything)
  // ==========================================
  {
    input: '<div fxLayout="row"></div>',
    shouldNotContain: ['fxLayout='],
    shouldContain: ['flex-row'],
    description: '✅ Regression: Normal double-quoted fxLayout'
  },

  {
    input: '<div fxShow fxShow.xs="false"></div>',
    shouldNotContain: ['fxShow='],
    shouldContain: ['show', 'hide-xs', 'show-gt-xs'],
    description: '✅ Regression: Inverse fxShow logic still works'
  },

  {
    input: '<div fxLayout="column nowrap"></div>',
    shouldNotContain: ['fxLayout='],
    shouldContain: ['flex-column', 'flex-nowrap'],
    description: '✅ Regression: Direction + wrap still works'
  },
];

console.log('Testing all cases:');
console.log('-'.repeat(80));

let passCount = 0;
let failCount = 0;

testCases.forEach(({ input, shouldContain = [], shouldNotContain = [], description }) => {
  const result = migrator.migrateTag(input);

  // Check should contain
  const allContained = shouldContain.every(str => result.includes(str));

  // Check should NOT contain
  const noneContained = shouldNotContain.every(str => !result.includes(str));

  const success = allContained && noneContained;

  if (success) passCount++;
  else failCount++;

  console.log(`${description}`);
  console.log(`  Input:    ${input}`);
  console.log(`  Output:   ${result}`);

  if (!allContained) {
    const missing = shouldContain.filter(str => !result.includes(str));
    console.log(`  ❌ Missing: ${missing.join(', ')}`);
  }

  if (!noneContained) {
    const foundUnwanted = shouldNotContain.filter(str => result.includes(str));
    console.log(`  ❌ Should not contain: ${foundUnwanted.join(', ')}`);
  }

  console.log(`  Status:   ${success ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`Results: ${passCount} PASS, ${failCount} FAIL`);
console.log('='.repeat(80));

if (failCount > 0) {
  console.log('');
  console.log('🔴 Some issues still remain!');
  process.exit(1);
} else {
  console.log('');
  console.log('✅ All issues_new4.txt issues are fixed!');
}
