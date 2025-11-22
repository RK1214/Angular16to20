const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_mixed.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_mixed.js');
const migrator = new FlexMigrator({ dryRun: false });
fs.unlinkSync(tempPath);

console.log('='.repeat(80));
console.log('Testing Mixed fxShow/fxHide Combinations (INVERSE LOGIC)');
console.log('='.repeat(80));
console.log('');

const testCases = [
  // SAME TYPE - Already working
  {
    input: '<div fxShow fxShow.xs="false"></div>',
    expected: 'show hide-xs show-gt-xs',
    description: '✅ fxShow + fxShow.xs="false" (same type)'
  },
  {
    input: '<div fxHide fxHide.xs="false"></div>',
    expected: 'hide show-xs hide-gt-xs',
    description: '✅ fxHide + fxHide.xs="false" (same type)'
  },

  // MIXED TYPE - User's reported issue
  {
    input: '<div fxHide fxShow.xs></div>',
    expected: 'hide show-xs hide-gt-xs',
    description: '🔴 fxHide + fxShow.xs (INVERSE - hide everywhere, show on xs)'
  },
  {
    input: '<div fxShow fxHide.xs></div>',
    expected: 'show hide-xs show-gt-xs',
    description: '🔴 fxShow + fxHide.xs (INVERSE - show everywhere, hide on xs)'
  },

  // More mixed type combinations
  {
    input: '<div fxShow="false" fxHide.xs="false"></div>',
    expected: 'hide show-xs hide-gt-xs',
    description: '🔴 fxShow="false" + fxHide.xs="false" (INVERSE - hide everywhere, show on xs)'
  },
  {
    input: '<div fxHide="false" fxShow.xs="false"></div>',
    expected: 'show hide-xs show-gt-xs',
    description: '🔴 fxHide="false" + fxShow.xs="false" (INVERSE - show everywhere, hide on xs)'
  },

  // Non-inverse mixed (should just combine)
  {
    input: '<div fxShow="false" fxHide.xs></div>',
    expected: 'hide',
    description: 'fxShow="false" + fxHide.xs (both hide, non-inverse)'
  },
  {
    input: '<div fxHide="false" fxShow.xs></div>',
    expected: 'show',
    description: 'fxHide="false" + fxShow.xs (both show, non-inverse)'
  },

  // Multiple breakpoints
  {
    input: '<div fxHide fxShow.xs fxShow.sm></div>',
    expected: 'hide show-xs show-sm',
    description: '🔴 fxHide + fxShow.xs + fxShow.sm (show on xs and sm only)'
  },
];

console.log('Testing all combinations:');
console.log('-'.repeat(80));

let passCount = 0;
let failCount = 0;

testCases.forEach(({ input, expected, description }) => {
  const result = migrator.migrateTag(input);

  // Check if all expected classes are present
  const expectedClasses = expected.split(' ');
  const allPresent = expectedClasses.every(cls => result.includes(cls));
  const success = result.includes('class="') && allPresent;

  if (success) passCount++;
  else failCount++;

  console.log(`${description}`);
  console.log(`  Input:    ${input}`);
  console.log(`  Expected: class="${expected}"`);
  console.log(`  Output:   ${result}`);
  console.log(`  Status:   ${success ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`Results: ${passCount} PASS, ${failCount} FAIL`);
console.log('='.repeat(80));

if (failCount > 0) {
  console.log('');
  console.log('🔴 ISSUES FOUND: Mixed fxShow/fxHide combinations not handled!');
  console.log('Need to update convertShowHideGroup() to handle cross-type combinations.');
}
