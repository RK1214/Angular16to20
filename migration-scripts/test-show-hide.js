const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_showhide.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_showhide.js');
const migrator = new FlexMigrator({ dryRun: false });
fs.unlinkSync(tempPath);

console.log('='.repeat(80));
console.log('Testing fxShow/fxHide Inverse Logic');
console.log('='.repeat(80));
console.log('');

const testCases = [
  {
    input: '<div fxShow></div>',
    expected: 'show',
    description: 'fxShow (show everywhere)'
  },
  {
    input: '<div fxHide></div>',
    expected: 'hide',
    description: 'fxHide (hide everywhere)'
  },
  {
    input: '<div fxShow fxShow.xs="false"></div>',
    expected: 'show hide-xs show-gt-xs',
    description: 'fxShow + fxShow.xs="false" (show everywhere except xs)'
  },
  {
    input: '<div fxHide fxHide.xs="false"></div>',
    expected: 'hide show-xs hide-gt-xs',
    description: 'fxHide + fxHide.xs="false" (hide everywhere except xs)'
  },
  {
    input: '<div fxShow="false" fxShow.sm></div>',
    expected: 'hide show-sm hide-gt-sm',
    description: 'fxShow="false" + fxShow.sm (hide everywhere except sm)'
  },
  {
    input: '<div fxHide="false" fxHide.md></div>',
    expected: 'show hide-md show-gt-md',
    description: 'fxHide="false" + fxHide.md (show everywhere except md)'
  },
  {
    input: '<div fxShow.xs></div>',
    expected: 'show-xs',
    description: 'fxShow.xs only (show on xs, no base)'
  },
  {
    input: '<div fxHide.lg></div>',
    expected: 'hide-lg',
    description: 'fxHide.lg only (hide on lg, no base)'
  },
];

console.log('Testing fxShow/fxHide combinations:');
console.log('-'.repeat(80));

testCases.forEach(({ input, expected, description }) => {
  const result = migrator.migrateTag(input);
  const success = result.includes('class="') && expected.split(' ').every(cls => result.includes(cls));

  console.log(`${description}`);
  console.log(`  Input:    ${input}`);
  console.log(`  Expected: class="${expected}"`);
  console.log(`  Output:   ${result}`);
  console.log(`  Status:   ${success ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('='.repeat(80));
console.log('Test Complete');
console.log('='.repeat(80));
