const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_align.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_align.js');
const migrator = new FlexMigrator({ dryRun: false });
fs.unlinkSync(tempPath);

console.log('='.repeat(80));
console.log('Testing fxLayoutAlign Conversions');
console.log('='.repeat(80));
console.log('');

const testCases = [
  { input: '<div fxLayoutAlign="start start"></div>', expected: 'align-start-start' },
  { input: '<div fxLayoutAlign="center"></div>', expected: 'align-center-start or similar' },
  { input: '<div fxLayoutAlign="center center"></div>', expected: 'align-center-center' },
  { input: '<div fxLayoutAlign="end"></div>', expected: 'align-end-start or similar' },
  { input: '<div fxLayoutAlign="space-between center"></div>', expected: 'align-space-between-center' },
  { input: '<div fxLayoutAlign="space-around"></div>', expected: 'align-space-around-...' },
  { input: '<div fxLayoutAlign.gt-xs="center center"></div>', expected: 'align-center-center-gt-xs' },
];

console.log('Testing various fxLayoutAlign values:');
console.log('-'.repeat(80));

testCases.forEach(({ input, expected }) => {
  const result = migrator.migrateTag(input);
  console.log(`Input:    ${input}`);
  console.log(`Expected: ${expected}`);
  console.log(`Output:   ${result}`);
  console.log('');
});

console.log('='.repeat(80));
console.log('Test Complete');
console.log('='.repeat(80));
