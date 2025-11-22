const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_layout.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_layout.js');
const migrator = new FlexMigrator({ dryRun: false });
fs.unlinkSync(tempPath);

console.log('='.repeat(80));
console.log('Testing fxLayout with Direction and Wrap Combinations');
console.log('='.repeat(80));
console.log('');

const testCases = [
  // Basic directions
  {
    input: '<div fxLayout="row"></div>',
    expectedClasses: ['flex-row'],
    description: 'fxLayout="row" (basic row)'
  },
  {
    input: '<div fxLayout="column"></div>',
    expectedClasses: ['flex-column'],
    description: 'fxLayout="column" (basic column)'
  },

  // User's reported issue
  {
    input: '<div class="test" fxFlex="100" fxLayout="column nowrap" fxLayoutGap="24px"></div>',
    expectedClasses: ['flex-column', 'flex-nowrap', 'gap-24', 'flex-100'],
    description: '🔴 USER ISSUE: fxLayout="column nowrap" (should have flex-column + flex-nowrap)'
  },

  // Direction with wrap
  {
    input: '<div fxLayout="row wrap"></div>',
    expectedClasses: ['flex-row', 'flex-wrap'],
    description: 'fxLayout="row wrap"'
  },
  {
    input: '<div fxLayout="column wrap"></div>',
    expectedClasses: ['flex-column', 'flex-wrap'],
    description: 'fxLayout="column wrap"'
  },

  // Direction with nowrap
  {
    input: '<div fxLayout="row nowrap"></div>',
    expectedClasses: ['flex-row', 'flex-nowrap'],
    description: 'fxLayout="row nowrap"'
  },

  // Reverse directions
  {
    input: '<div fxLayout="row-reverse"></div>',
    expectedClasses: ['flex-row-reverse'],
    description: 'fxLayout="row-reverse"'
  },
  {
    input: '<div fxLayout="column-reverse"></div>',
    expectedClasses: ['flex-column-reverse'],
    description: 'fxLayout="column-reverse"'
  },

  // Reverse with wrap
  {
    input: '<div fxLayout="row-reverse wrap"></div>',
    expectedClasses: ['flex-row-reverse', 'flex-wrap'],
    description: 'fxLayout="row-reverse wrap"'
  },
  {
    input: '<div fxLayout="column-reverse nowrap"></div>',
    expectedClasses: ['flex-column-reverse', 'flex-nowrap'],
    description: 'fxLayout="column-reverse nowrap"'
  },

  // Wrap-reverse
  {
    input: '<div fxLayout="row wrap-reverse"></div>',
    expectedClasses: ['flex-row', 'flex-wrap-reverse'],
    description: 'fxLayout="row wrap-reverse"'
  },
  {
    input: '<div fxLayout="column wrap-reverse"></div>',
    expectedClasses: ['flex-column', 'flex-wrap-reverse'],
    description: 'fxLayout="column wrap-reverse"'
  },

  // Case variations
  {
    input: '<div fxLayout="COLUMN NOWRAP"></div>',
    expectedClasses: ['flex-column', 'flex-nowrap'],
    description: 'fxLayout="COLUMN NOWRAP" (uppercase)'
  },
];

console.log('Testing all layout combinations:');
console.log('-'.repeat(80));

let passCount = 0;
let failCount = 0;

testCases.forEach(({ input, expectedClasses, description }) => {
  const result = migrator.migrateTag(input);

  // Check if all expected classes are present
  const allPresent = expectedClasses.every(cls => result.includes(`class=`) && result.includes(cls));
  const success = allPresent;

  if (success) passCount++;
  else failCount++;

  console.log(`${description}`);
  console.log(`  Input:    ${input}`);
  console.log(`  Expected: ${expectedClasses.join(' ')}`);
  console.log(`  Output:   ${result}`);
  console.log(`  Status:   ${success ? '✅ PASS' : '❌ FAIL'}`);

  if (!success) {
    const missing = expectedClasses.filter(cls => !result.includes(cls));
    if (missing.length > 0) {
      console.log(`  Missing:  ${missing.join(', ')}`);
    }
  }
  console.log('');
});

console.log('='.repeat(80));
console.log(`Results: ${passCount} PASS, ${failCount} FAIL`);
console.log('='.repeat(80));

if (failCount > 0) {
  console.log('');
  console.log('🔴 ISSUES FOUND: Some layout combinations not handled correctly!');
  process.exit(1);
} else {
  console.log('');
  console.log('✅ All layout combinations working correctly!');
}
